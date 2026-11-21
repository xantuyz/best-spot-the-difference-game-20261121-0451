// main.js — menghubungkan semua modul dan memulai game.
// Alur: layar awal (pilih Mode Waktu / Santai) -> cari 7 perbedaan ->
// ringkasan strip bawah -> lanjut -> hasil akhir 21/21 -> main lagi.
// Timer berhenti saat jeda, transisi, ringkasan, dan tab tidak aktif.

import { createThreeProgressiveLevels } from './levels.js';
import {
  findDifferenceAtPoint, pointHitsFoundDifference, validateDifferenceDefinitions,
} from './differences.js';
import {
  createGameSession, currentLevel, foundCount, remainingCount, beginLevel,
  recordDiscoveredDifference, advanceToNextScene, retryCurrentLevel,
  switchToRelaxedMode, tickGameClock, applyMistakeTimePenalty, useHint,
  formatClock, MODE_TIMED, MODE_RELAXED, STATUS_PLAYING, STATUS_PAUSED,
  STATUS_SUMMARY, STATUS_TIMEOUT, STATUS_COMPLETE, STATUS_START,
} from './state.js';
import { renderPairedScenes } from './render.js';
import { bindMouseAndKeyboardControls } from './input.js';
import {
  ensureAudioContext, setAudioMuted, playDiscoveryChime, playMistakeTone,
  playSceneCompleteChime, playHintTone,
} from './audio.js';

const MAX_FRAME_SECONDS = 0.25;

/** Siapkan kanvas 600x480 logis dengan skala devicePixelRatio. */
function setupPanelCanvas(canvas) {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = 600 * dpr;
  canvas.height = 480 * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function startSpotTheDifferenceGame() {
  const leftCanvas = document.getElementById('panel-left');
  const rightCanvas = document.getElementById('panel-right');
  const leftCtx = setupPanelCanvas(leftCanvas);
  const rightCtx = setupPanelCanvas(rightCanvas);
  window.addEventListener('resize', () => {
    setupPanelCanvas(leftCanvas);
    setupPanelCanvas(rightCanvas);
  });

  const ui = {
    level: document.getElementById('hud-level'),
    found: document.getElementById('hud-found'),
    remaining: document.getElementById('hud-remaining'),
    timer: document.getElementById('hud-timer'),
    score: document.getElementById('hud-score'),
    mode: document.getElementById('hud-mode'),
    hint: document.getElementById('btn-hint'),
    sound: document.getElementById('btn-sound'),
    pause: document.getElementById('btn-pause'),
    feedback: document.getElementById('feedback'),
    chips: document.getElementById('found-chips'),
    startOverlay: document.getElementById('start-overlay'),
    pauseOverlay: document.getElementById('pause-overlay'),
    strip: document.getElementById('bottom-strip'),
    dots: [
      document.getElementById('dot-0'),
      document.getElementById('dot-1'),
      document.getElementById('dot-2'),
    ],
  };

  const levels = createThreeProgressiveLevels();
  const definitionProblems = validateDifferenceDefinitions(levels);
  if (definitionProblems.length > 0) {
    console.error('Definisi perbedaan bermasalah:', definitionProblems);
  }

  let chosenMode = MODE_TIMED;
  let session = createGameSession(levels, chosenMode);
  const game = {
    session,
    foundAtMs: {},
    mistakeMarks: [],
    keyboardCursor: { panel: 0, x: 300, y: 240, visible: false },
  };
  // Pegangan untuk playtest otomatis (membaca state, bukan mengubahnya).
  window.__spotGame = game;

  let feedbackUntilMs = 0;
  let feedbackDefault = 'Loket penerimaan — cari 7 perbedaan.';
  function showFeedback(message) {
    ui.feedback.textContent = message;
    ui.feedback.classList.add('show');
    feedbackUntilMs = performance.now() + 1800;
  }

  function updateChips() {
    const level = currentLevel(session);
    ui.chips.innerHTML = '';
    for (const diff of level.differences) {
      const chip = document.createElement('span');
      chip.className = 'chip' + (session.foundIds.has(diff.id) ? ' found' : '');
      chip.textContent = session.foundIds.has(diff.id) ? `✓ ${diff.label}` : '?';
      chip.title = session.foundIds.has(diff.id) ? diff.label : 'Belum ditemukan';
      ui.chips.appendChild(chip);
    }
  }

  function updateHud() {
    const level = currentLevel(session);
    ui.level.textContent = `Level ${session.levelIndex + 1}/3`;
    ui.found.textContent = `Ditemukan ${foundCount(session)}/7`;
    ui.remaining.textContent = `Sisa ${remainingCount(session)}`;
    ui.score.textContent = `Skor ${session.score}`;
    ui.mode.textContent = session.mode === MODE_TIMED ? 'Mode Waktu' : 'Mode Santai · tanpa batas waktu';
    if (session.mode === MODE_TIMED) {
      ui.timer.textContent = formatClock(session.timeLeftSeconds);
      ui.timer.classList.toggle('low', session.timeLeftSeconds <= 30);
    } else {
      ui.timer.textContent = formatClock(session.elapsedSeconds);
      ui.timer.classList.remove('low');
    }
    ui.hint.textContent = `Petunjuk · ${session.hintsLeft} tersisa`;
    ui.hint.disabled = session.status !== STATUS_PLAYING
      || session.hintsLeft <= 0
      || session.hintUntilMs > performance.now();
    ui.pause.disabled = session.status !== STATUS_PLAYING && session.status !== STATUS_PAUSED;
    ui.dots.forEach((dot, i) => {
      dot.classList.toggle('done', i < session.levelIndex);
      dot.classList.toggle('current', i === session.levelIndex);
    });
    updateChips();
  }

  function showStrip(html) {
    ui.strip.innerHTML = html;
    ui.strip.classList.remove('hidden');
    ui.strip.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => handleStripAction(button.dataset.action));
    });
  }

  function hideStrip() {
    ui.strip.classList.add('hidden');
    ui.strip.innerHTML = '';
  }

  function showSummaryStrip() {
    const level = currentLevel(session);
    if (session.status === STATUS_COMPLETE) {
      showStrip(
        `<strong>Semua selesai · 21/21 ditemukan</strong>`
        + `<span>Skor akhir ${session.score} · ${session.mistakes} kali salah · `
        + `${formatClock(session.elapsedSeconds)}</span>`
        + `<button data-action="restart" type="button">Main lagi</button>`,
      );
      return;
    }
    showStrip(
      `<strong>${level.name} selesai! 7/7 ditemukan</strong>`
      + `<span>+700 poin${session.levelBonus > 0 ? ` · bonus waktu +${session.levelBonus}` : ''} · Skor ${session.score}</span>`
      + `<button data-action="next" type="button">Lanjut ke Level ${session.levelIndex + 2} ⏎</button>`,
    );
  }

  function showTimeoutStrip() {
    const level = currentLevel(session);
    showStrip(
      `<strong>Waktu habis!</strong>`
      + `<span>${level.name} baru ${foundCount(session)}/7. Skor kembali ke awal level bila mengulang.</span>`
      + `<button data-action="retry" type="button">Ulangi Level</button>`
      + `<button data-action="relaxed" type="button">Lanjut Santai</button>`,
    );
  }

  function handleStripAction(action) {
    ensureAudioContext();
    if (action === 'next') {
      hideStrip();
      advanceToNextScene(session);
      game.foundAtMs = {};
      game.mistakeMarks = [];
      feedbackDefault = `${currentLevel(session).place} — cari 7 perbedaan.`;
      showFeedback(`Level ${session.levelIndex + 1}: ${currentLevel(session).name}`);
    } else if (action === 'retry') {
      hideStrip();
      retryCurrentLevel(session);
      game.foundAtMs = {};
      game.mistakeMarks = [];
      showFeedback('Level diulang — waktu kembali penuh.');
    } else if (action === 'relaxed') {
      hideStrip();
      switchToRelaxedMode(session);
      showFeedback('Mode Santai: tanpa batas waktu, tanpa penalti.');
    } else if (action === 'restart') {
      hideStrip();
      startFreshGame(session.mode);
    }
    updateHud();
  }

  function startFreshGame(mode) {
    session = createGameSession(levels, mode);
    game.session = session;
    game.foundAtMs = {};
    game.mistakeMarks = [];
    game.keyboardCursor.visible = false;
    beginLevel(session, performance.now());
    ui.startOverlay.classList.add('hidden');
    ui.pauseOverlay.classList.add('hidden');
    hideStrip();
    feedbackDefault = `${currentLevel(session).place} — cari 7 perbedaan.`;
    showFeedback(`Level 1: ${currentLevel(session).name} — cari 7 perbedaan!`);
    updateHud();
  }

  function handlePanelClick(panelIndex, x, y) {
    if (session.status !== STATUS_PLAYING) return;
    ensureAudioContext();
    const nowMs = performance.now();
    const level = currentLevel(session);
    const diff = findDifferenceAtPoint(level, session.foundIds, x, y);
    if (diff) {
      recordDiscoveredDifference(session, diff, nowMs);
      game.foundAtMs[diff.id] = nowMs;
      playDiscoveryChime();
      showFeedback(`Cocok! +100 — ${diff.label}`);
      if (session.status === STATUS_SUMMARY || session.status === STATUS_COMPLETE) {
        playSceneCompleteChime();
        showSummaryStrip();
      }
      updateHud();
      return;
    }
    if (pointHitsFoundDifference(level, session.foundIds, x, y)) {
      showFeedback('Itu sudah ditemukan.');
      return;
    }
    const penalty = applyMistakeTimePenalty(session, nowMs);
    playMistakeTone();
    game.mistakeMarks.push({ panel: panelIndex, x, y, atMs: nowMs });
    if (session.status === STATUS_TIMEOUT) {
      showTimeoutStrip();
      showFeedback('Waktu habis!');
    } else if (session.mode === MODE_TIMED) {
      showFeedback(penalty > 0 ? `Bukan itu — penalti ${penalty} detik.` : 'Bukan itu — coba lagi.');
    } else {
      showFeedback('Bukan itu — coba lagi.');
    }
    updateHud();
  }

  function handleHint() {
    if (session.status !== STATUS_PLAYING) return;
    ensureAudioContext();
    const nowMs = performance.now();
    const target = useHint(session, nowMs);
    if (!target) return;
    playHintTone();
    showFeedback(`Petunjuk: ${target.hint}`);
    updateHud();
  }

  function togglePause() {
    if (session.status === STATUS_PLAYING) {
      session.status = STATUS_PAUSED;
      ui.pauseOverlay.classList.remove('hidden');
      showFeedback('Jeda — timer berhenti.');
    } else if (session.status === STATUS_PAUSED) {
      session.status = STATUS_PLAYING;
      ui.pauseOverlay.classList.add('hidden');
      showFeedback('Lanjut!');
    }
    updateHud();
  }

  function toggleMute() {
    session.muted = !session.muted;
    setAudioMuted(session.muted);
    ui.sound.textContent = session.muted ? '🔇 Suara mati' : '🔊 Suara';
    ui.sound.setAttribute('aria-pressed', String(session.muted));
  }

  function handleConfirm() {
    if (session.status === STATUS_SUMMARY) handleStripAction('next');
    else if (session.status === STATUS_COMPLETE) handleStripAction('restart');
    else if (session.status === STATUS_PAUSED) togglePause();
    else if (session.status === STATUS_START) startFreshGame(chosenMode);
  }

  // Tombol-tombol HUD dan layar awal.
  ui.hint.addEventListener('click', handleHint);
  ui.sound.addEventListener('click', toggleMute);
  ui.pause.addEventListener('click', togglePause);
  document.getElementById('btn-resume').addEventListener('click', togglePause);
  document.getElementById('btn-start').addEventListener('click', () => startFreshGame(chosenMode));
  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      chosenMode = button.dataset.mode;
      document.querySelectorAll('[data-mode]').forEach((b) => {
        b.classList.toggle('selected', b === button);
      });
    });
  });

  bindMouseAndKeyboardControls(leftCanvas, rightCanvas, {
    onPanelClick: handlePanelClick,
    onHint: handleHint,
    onPauseToggle: togglePause,
    onMuteToggle: toggleMute,
    onConfirm: handleConfirm,
    onCursorMove: (panel, x, y) => {
      game.keyboardCursor.panel = panel;
      game.keyboardCursor.x = x;
      game.keyboardCursor.y = y;
      game.keyboardCursor.visible = true;
    },
    onCursorActivate: (panel, x, y) => handlePanelClick(panel, x, y),
    onFirstGesture: () => ensureAudioContext(),
  });

  // Jeda otomatis saat tab tidak aktif: timer tidak terus berkurang.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && session.status === STATUS_PLAYING) {
      session.status = STATUS_PAUSED;
      ui.pauseOverlay.classList.remove('hidden');
      updateHud();
    }
  });

  // Loop utama: jam hanya berjalan saat status bermain.
  let lastMs = performance.now();
  let clockAccumulator = 0;
  function frame(nowMs) {
    requestAnimationFrame(frame);
    const delta = Math.min(MAX_FRAME_SECONDS, Math.max(0, (nowMs - lastMs) / 1000));
    lastMs = nowMs;
    if (session.status === STATUS_PLAYING) {
      clockAccumulator += delta;
      if (clockAccumulator >= 1) {
        const whole = Math.floor(clockAccumulator);
        clockAccumulator -= whole;
        const timedOut = tickGameClock(session, whole);
        if (timedOut) {
          showTimeoutStrip();
          showFeedback('Waktu habis!');
        }
      }
    } else {
      clockAccumulator = 0;
    }
    if (feedbackUntilMs && nowMs > feedbackUntilMs) {
      ui.feedback.textContent = feedbackDefault;
      ui.feedback.classList.remove('show');
      feedbackUntilMs = 0;
    }
    game.mistakeMarks = game.mistakeMarks.filter((m) => nowMs - m.atMs < 700);
    renderPairedScenes(leftCtx, rightCtx, game, nowMs);
    updateHud();
  }

  updateHud();
  requestAnimationFrame(frame);
}

startSpotTheDifferenceGame();
