// state.js — sesi permainan: timer, skor, hint, penyelesaian level.
// Mode Waktu: batas per level, klik salah -3 detik. Mode Santai: tanpa batas
// waktu dan tanpa penalti, yang dinyatakan jelas di HUD. Timer berhenti saat
// jeda, transisi, ringkasan, dan tab tidak aktif (pemanggil tidak memanggil tick).

export const MODE_TIMED = 'timed';
export const MODE_RELAXED = 'relaxed';
export const POINTS_PER_FIND = 100;
export const MISTAKE_PENALTY_SECONDS = 3;
export const HINTS_PER_LEVEL = 2;
export const HINT_HIGHLIGHT_MS = 3000;
export const MISTAKE_COOLDOWN_MS = 1000;

export const STATUS_START = 'start';
export const STATUS_PLAYING = 'playing';
export const STATUS_PAUSED = 'paused';
export const STATUS_SUMMARY = 'summary';
export const STATUS_TIMEOUT = 'timeout';
export const STATUS_COMPLETE = 'complete';

/** Sesi baru untuk satu permainan penuh (3 level). */
export function createGameSession(levels, mode) {
  return {
    levels,
    mode,
    levelIndex: 0,
    status: STATUS_START,
    score: 0,
    levelStartScore: 0,
    foundIds: new Set(),
    foundOrder: [],
    hintsLeft: HINTS_PER_LEVEL,
    hintTargetId: null,
    hintUntilMs: 0,
    timeLeftSeconds: levels[0].timeLimitSeconds,
    elapsedSeconds: 0,
    mistakes: 0,
    lastMistakeAtMs: 0,
    levelBonus: 0,
    totalFound: 0,
    muted: false,
    finishedAtMs: 0,
  };
}

export function currentLevel(session) {
  return session.levels[session.levelIndex];
}

export function foundCount(session) {
  return session.foundIds.size;
}

export function remainingCount(session) {
  return currentLevel(session).differences.length - session.foundIds.size;
}

export function totalFoundCount(session) {
  return session.totalFound;
}

/** Mulai (atau mulai ulang) level saat ini dari keadaan bersih. */
export function beginLevel(session, nowMs) {
  const level = currentLevel(session);
  session.foundIds = new Set();
  session.foundOrder = [];
  session.hintsLeft = HINTS_PER_LEVEL;
  session.hintTargetId = null;
  session.hintUntilMs = 0;
  session.timeLeftSeconds = level.timeLimitSeconds;
  session.levelStartScore = session.score;
  session.levelBonus = 0;
  session.status = STATUS_PLAYING;
  session.lastMistakeAtMs = 0;
  return level;
}

/**
 * Catat satu temuan: +100 poin, simpan urutan temuan. Bila 7/7, level selesai:
 * bonus waktu (mode Waktu saja) = sisa detik, status jadi ringkasan.
 */
export function recordDiscoveredDifference(session, diff, nowMs) {
  if (session.foundIds.has(diff.id)) return false;
  session.foundIds.add(diff.id);
  session.foundOrder.push(diff.id);
  session.totalFound += 1;
  session.score += POINTS_PER_FIND;
  if (session.foundIds.size >= currentLevel(session).differences.length) {
    session.levelBonus = session.mode === MODE_TIMED
      ? Math.max(0, Math.floor(session.timeLeftSeconds))
      : 0;
    session.score += session.levelBonus;
    session.status = STATUS_SUMMARY;
    if (session.levelIndex >= session.levels.length - 1) {
      session.status = STATUS_COMPLETE;
      session.finishedAtMs = nowMs;
    }
  }
  return true;
}

/** Lanjut ke scene berikutnya; false bila sudah di level terakhir. */
export function advanceToNextScene(session) {
  if (session.levelIndex >= session.levels.length - 1) return false;
  session.levelIndex += 1;
  beginLevel(session, performance.now());
  return true;
}

/** Ulangi level saat ini (dipakai saat waktu habis): skor kembali ke awal level. */
export function retryCurrentLevel(session) {
  session.score = session.levelStartScore;
  session.totalFound -= session.foundIds.size;
  beginLevel(session, performance.now());
}

/** Beralih ke Mode Santai di tengah level: temuan dipertahankan, timer dimatikan. */
export function switchToRelaxedMode(session) {
  session.mode = MODE_RELAXED;
  session.status = STATUS_PLAYING;
}

/** Satu detik permainan berlalu; mengembalikan true bila waktu baru saja habis. */
export function tickGameClock(session, deltaSeconds) {
  if (session.status !== STATUS_PLAYING) return false;
  session.elapsedSeconds += deltaSeconds;
  if (session.mode !== MODE_TIMED) return false;
  session.timeLeftSeconds -= deltaSeconds;
  if (session.timeLeftSeconds <= 0) {
    session.timeLeftSeconds = 0;
    session.status = STATUS_TIMEOUT;
    return true;
  }
  return false;
}

/** Penalti klik salah: -3 detik (mode Waktu saja), dengan jeda 1 detik antar penalti. */
export function applyMistakeTimePenalty(session, nowMs) {
  session.mistakes += 1;
  if (session.mode !== MODE_TIMED) return 0;
  if (nowMs - session.lastMistakeAtMs < MISTAKE_COOLDOWN_MS) return 0;
  session.lastMistakeAtMs = nowMs;
  session.timeLeftSeconds = Math.max(0, session.timeLeftSeconds - MISTAKE_PENALTY_SECONDS);
  if (session.timeLeftSeconds <= 0) session.status = STATUS_TIMEOUT;
  return MISTAKE_PENALTY_SECONDS;
}

/**
 * Pakai satu hint: sorot perbedaan pertama yang belum ditemukan selama 3 detik.
 * Mengembalikan definisi targetnya, atau null bila hint habis / sedang aktif.
 */
export function useHint(session, nowMs) {
  if (session.hintsLeft <= 0) return null;
  if (session.hintUntilMs > nowMs) return null;
  const level = currentLevel(session);
  const target = level.differences.find((d) => !session.foundIds.has(d.id)) || null;
  if (!target) return null;
  session.hintsLeft -= 1;
  session.hintTargetId = target.id;
  session.hintUntilMs = nowMs + HINT_HIGHLIGHT_MS;
  return target;
}

export function formatClock(totalSeconds) {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}
