// render.js — menggambar dua panel berdampingan beserta marker temuan.
// Marker: cincin koral TANPA isi, sedikit lebih besar dari objek, plus centang
// kecil; tanpa garis penghubung antar panel. Animasi cincin ~250 ms lalu diam.

import { CORAL, HONEY, INK } from './art.js';
import { drawIntakeCounterScene, drawSortingRoomScene, drawNightGreenhouseScene } from './scenes.js';
import { PANEL_WIDTH, PANEL_HEIGHT } from './levels.js';

export const DISCOVERY_ANIM_MS = 250;

const SCENE_DRAWERS = [
  drawIntakeCounterScene,
  drawSortingRoomScene,
  drawNightGreenhouseScene,
];

/** Gambar satu panel (kiri = variant 0, kanan = variant 1) ke kanvasnya. */
export function renderSinglePanel(ctx, levelIndex, variant) {
  SCENE_DRAWERS[levelIndex](ctx, variant);
}

/**
 * Gambar cincin temuan di kedua panel: panel kiri memakai marker.marker,
 * panel kanan memakai marker.markerRight (beda bila objek berpindah posisi).
 */
export function markDifferenceOnBothPanels(leftCtx, rightCtx, diff, nowMs, foundAtMs) {
  const age = nowMs - foundAtMs;
  const progress = Math.min(1, age / DISCOVERY_ANIM_MS);
  const scale = 0.7 + 0.3 * progress;
  const alpha = 0.35 + 0.65 * progress;
  drawDiscoveryRing(leftCtx, diff.marker, scale, alpha);
  drawDiscoveryRing(rightCtx, diff.markerRight, scale, alpha);
}

function drawDiscoveryRing(ctx, marker, scale, alpha) {
  const r = marker.r * scale;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(marker.x, marker.y, r, 0, Math.PI * 2);
  ctx.strokeStyle = CORAL;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(marker.x, marker.y, r - 5, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,248,236,0.85)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Centang kecil di kanan atas cincin.
  const cx = marker.x + r * 0.72;
  const cy = marker.y - r * 0.72;
  ctx.beginPath();
  ctx.arc(cx, cy, 10, 0, Math.PI * 2);
  ctx.fillStyle = CORAL;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy);
  ctx.lineTo(cx - 1.5, cy + 3.5);
  ctx.lineTo(cx + 5, cy - 3.5);
  ctx.strokeStyle = '#FFF8EC';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();
}

/** Sorot hint: cincin madu putus-putus yang berdenyut di wilayah target. */
export function drawHintHighlight(ctx, diff, nowMs, hintUntilMs) {
  const remaining = Math.max(0, hintUntilMs - nowMs);
  const pulse = 0.55 + 0.45 * Math.sin((nowMs / 240) % (Math.PI * 2));
  ctx.save();
  ctx.globalAlpha = 0.25 + 0.55 * pulse * (remaining > 500 ? 1 : remaining / 500);
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(diff.marker.x, diff.marker.y, diff.marker.r + 8, 0, Math.PI * 2);
  ctx.strokeStyle = HONEY;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

/** Tanda X merah lembut di titik klik yang salah (hilang setelah ~600 ms). */
export function drawMistakeMark(ctx, x, y, ageMs) {
  if (ageMs > 600) return;
  const alpha = 1 - ageMs / 600;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#C0392B';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 10);
  ctx.lineTo(x + 10, y + 10);
  ctx.moveTo(x + 10, y - 10);
  ctx.lineTo(x - 10, y + 10);
  ctx.stroke();
  ctx.restore();
}

/** Kursor keyboard: bidik silang + cincin fokus yang jelas di panel aktif. */
export function drawKeyboardCursor(ctx, x, y, visible) {
  if (!visible) return;
  ctx.save();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 22, y);
  ctx.lineTo(x - 8, y);
  ctx.moveTo(x + 8, y);
  ctx.lineTo(x + 22, y);
  ctx.moveTo(x, y - 22);
  ctx.lineTo(x, y - 8);
  ctx.moveTo(x, y + 8);
  ctx.lineTo(x, y + 22);
  ctx.stroke();
  ctx.fillStyle = CORAL;
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Gambar ulang kedua panel lengkap: scene + marker + hint + klik salah + kursor. */
export function renderPairedScenes(leftCtx, rightCtx, game, nowMs) {
  const levelIndex = game.session.levelIndex;
  renderSinglePanel(leftCtx, levelIndex, 0);
  renderSinglePanel(rightCtx, levelIndex, 1);
  const session = game.session;
  const level = session.levels[levelIndex];
  for (const diffId of session.foundIds) {
    const diff = level.differences.find((d) => d.id === diffId);
    if (!diff) continue;
    const foundAt = game.foundAtMs[diffId] || nowMs;
    markDifferenceOnBothPanels(leftCtx, rightCtx, diff, nowMs, foundAt);
  }
  if (session.hintTargetId && session.hintUntilMs > nowMs) {
    const target = level.differences.find((d) => d.id === session.hintTargetId);
    if (target) {
      drawHintHighlight(leftCtx, target, nowMs, session.hintUntilMs);
      const rightTarget = { ...target, marker: target.markerRight };
      drawHintHighlight(rightCtx, rightTarget, nowMs, session.hintUntilMs);
    }
  }
  for (const mark of game.mistakeMarks) {
    const ctx = mark.panel === 0 ? leftCtx : rightCtx;
    drawMistakeMark(ctx, mark.x, mark.y, nowMs - mark.atMs);
  }
  if (game.keyboardCursor.visible) {
    const ctx = game.keyboardCursor.panel === 0 ? leftCtx : rightCtx;
    drawKeyboardCursor(ctx, game.keyboardCursor.x, game.keyboardCursor.y, true);
  }
}

export { PANEL_WIDTH, PANEL_HEIGHT };
