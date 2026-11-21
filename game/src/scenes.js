// scenes.js — tiga komposisi ilustrasi dan variannya.
// Tiap fungsi menggambar SATU panel (600x480 logis): variant 0 = ARSIP ASLI,
// variant 1 = SALINAN GANJIL dengan tepat 7 perubahan semantik dari levels.js.
// Dekorasi (bintik kertas, bayangan, tanaman) identik di kedua panel —
// hanya 7 perbedaan terdaftar yang berubah.

import {
  PAPER, CREAM, INK, TERRA, TEAL, TEAL_DARK, HONEY, SAGE, SAGE_DARK,
  NIGHT, NAVY, CORAL, WOOD, WOOD_DARK, BRASS, ROSE,
  mulberry32, roundedRectPath, fillRoundedRect, strokeRoundedRect,
  fillDisc, strokeDisc, fillEllipse, drawLine, fillPolygon, drawLabelText,
  drawPaperGrain, drawSceneFrame, drawMoonPostageStamp, drawCloudSuitcase,
  drawServiceBell, drawEmptyBellBase,
} from './art.js';

const W = 600;
const H = 480;

/* ------------------------------------------------------------------ */
/* Level 1 — Loket Kiriman Mustahil                                    */
/* ------------------------------------------------------------------ */

function drawWallClock(ctx, cx, cy, variant) {
  fillDisc(ctx, cx, cy, 36, CREAM);
  strokeDisc(ctx, cx, cy, 36, INK, 3);
  strokeDisc(ctx, cx, cy, 30, INK, 1);
  for (let i = 0; i < 12; i += 1) {
    const a = (i * Math.PI) / 6;
    drawLine(ctx, cx + Math.cos(a) * 27, cy + Math.sin(a) * 27, cx + Math.cos(a) * 30, cy + Math.sin(a) * 30, INK, 2);
  }
  // Jarum pendek identik di kedua panel: menunjuk pukul 10.
  const shortAngle = (-150 * Math.PI) / 180;
  drawLine(ctx, cx, cy, cx + Math.cos(shortAngle) * 16, cy + Math.sin(shortAngle) * 16, INK, 4);
  // Jarum panjang: panel kiri ke 12 (panjang, tipis); kanan ke 3 (pendek, tebal).
  if (variant === 0) {
    drawLine(ctx, cx, cy, cx, cy - 26, INK, 2.5);
  } else {
    drawLine(ctx, cx, cy, cx + 20, cy, INK, 4.5);
  }
  fillDisc(ctx, cx, cy, 4, TERRA);
}

function drawQueueBoard(ctx, variant) {
  fillRoundedRect(ctx, 396, 58, 148, 60, 8, TEAL_DARK);
  strokeRoundedRect(ctx, 396, 58, 148, 60, 8, INK, 2.5);
  drawLabelText(ctx, 'ANTRIAN', 470, 76, 15, CREAM, 'center', 'bold');
  drawLabelText(ctx, '07', 470, 102, 24, HONEY, 'center', 'bold');
  // Tab nomor besar di bawah papan: dua (kiri) vs tiga (kanan).
  const tabs = variant === 0 ? ['07', '08'] : ['07', '08', '09'];
  const tabW = 40;
  const gap = 6;
  const total = tabs.length * tabW + (tabs.length - 1) * gap;
  let x = 470 - total / 2;
  for (const label of tabs) {
    fillRoundedRect(ctx, x, 126, tabW, 30, 6, HONEY);
    strokeRoundedRect(ctx, x, 126, tabW, 30, 6, INK, 2);
    drawLabelText(ctx, label, x + tabW / 2, 142, 16, INK, 'center', 'bold');
    x += tabW + gap;
  }
}

function drawTariffBoard(ctx) {
  fillRoundedRect(ctx, 290, 66, 96, 74, 8, CREAM);
  strokeRoundedRect(ctx, 290, 66, 96, 74, 8, INK, 2.5);
  drawLabelText(ctx, 'TARIF', 338, 80, 12, INK, 'center', 'bold');
  const rows = [['Bulan', '2'], ['Awan', '3'], ['Mimpi', '5']];
  rows.forEach((row, i) => {
    const y = 100 + i * 13;
    drawLabelText(ctx, row[0], 300, y, 11, INK, 'left', 'normal');
    drawLabelText(ctx, row[1], 376, y, 11, TERRA, 'right', 'bold');
  });
}

function drawUmbrellaStand(ctx, variant) {
  // Wadah payung di lantai dekat pintu.
  fillRoundedRect(ctx, 40, 330, 40, 58, 6, WOOD);
  strokeRoundedRect(ctx, 40, 330, 40, 58, 6, INK, 2.5);
  drawLine(ctx, 40, 344, 80, 344, WOOD_DARK, 3);
  // Payung belakang (sage, tetap).
  drawLine(ctx, 46, 332, 40, 296, INK, 3);
  ctx.beginPath();
  ctx.moveTo(40, 296);
  ctx.quadraticCurveTo(28, 318, 52, 322);
  ctx.quadraticCurveTo(44, 306, 40, 296);
  ctx.closePath();
  ctx.fillStyle = SAGE;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.stroke();
  // Payung depan (yang berubah): teal bergaris -> kuning bertitik besar.
  drawLine(ctx, 66, 332, 72, 292, INK, 3);
  ctx.beginPath();
  ctx.moveTo(72, 290);
  ctx.quadraticCurveTo(46, 306, 44, 334);
  ctx.quadraticCurveTo(58, 322, 72, 326);
  ctx.quadraticCurveTo(86, 322, 94, 334);
  ctx.quadraticCurveTo(92, 306, 72, 290);
  ctx.closePath();
  ctx.fillStyle = variant === 0 ? TEAL : HONEY;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.stroke();
  if (variant === 0) {
    ctx.save();
    ctx.clip();
    drawLine(ctx, 56, 296, 50, 330, CREAM, 3);
    drawLine(ctx, 72, 292, 72, 328, CREAM, 3);
    drawLine(ctx, 88, 296, 94, 330, CREAM, 3);
    ctx.restore();
  } else {
    fillDisc(ctx, 60, 308, 4, TERRA);
    fillDisc(ctx, 78, 314, 4, TERRA);
    fillDisc(ctx, 66, 324, 4, TERRA);
    fillDisc(ctx, 86, 326, 3, TERRA);
  }
}

function drawShelfRibbonParcel(ctx, variant) {
  // Rak belakang + paket berpita yang menjuntai.
  fillRoundedRect(ctx, 288, 212, 124, 8, 3, WOOD_DARK);
  // Paket kedua (tetap) di kiri rak.
  fillRoundedRect(ctx, 250, 182, 34, 30, 4, SAGE);
  strokeRoundedRect(ctx, 250, 182, 34, 30, 4, INK, 2);
  drawLine(ctx, 267, 182, 267, 212, CREAM, 4);
  // Paket berpita utama.
  fillRoundedRect(ctx, 312, 166, 72, 46, 4, '#D9B98A');
  strokeRoundedRect(ctx, 312, 166, 72, 46, 4, INK, 2.5);
  fillRoundedRect(ctx, 340, 166, 16, 46, 0, TERRA);
  fillRoundedRect(ctx, 312, 184, 72, 10, 0, TERRA);
  // Ujung pita menjuntai di bawah rak: runcing (kiri) vs cabang V lebar (kanan).
  if (variant === 0) {
    fillPolygon(ctx, [[340, 220], [356, 220], [348, 250]], TERRA);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(340, 220);
    ctx.lineTo(348, 250);
    ctx.lineTo(356, 220);
    ctx.stroke();
  } else {
    fillPolygon(ctx, [[340, 220], [356, 220], [358, 246], [350, 234], [348, 228], [346, 234], [338, 246]], TERRA);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(340, 220);
    ctx.lineTo(338, 246);
    ctx.lineTo(346, 234);
    ctx.lineTo(350, 234);
    ctx.lineTo(358, 246);
    ctx.lineTo(356, 220);
    ctx.stroke();
  }
}

export function drawIntakeCounterScene(ctx, variant) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  // Dinding bawah + lantai.
  ctx.fillStyle = '#EAD9BE';
  ctx.fillRect(0, 300, W, 100);
  ctx.fillStyle = '#D9BE96';
  ctx.fillRect(0, 400, W, 80);
  drawLine(ctx, 0, 400, W, 400, INK, 2);
  for (let i = 0; i < 6; i += 1) drawLine(ctx, i * 100, 400, i * 100 + 40, 480, '#C4A87E', 1.5);

  // Pintu kiri.
  fillRoundedRect(ctx, 18, 140, 92, 260, 6, WOOD);
  strokeRoundedRect(ctx, 18, 140, 92, 260, 6, INK, 2.5);
  fillRoundedRect(ctx, 30, 156, 68, 100, 4, WOOD_DARK);
  fillRoundedRect(ctx, 30, 272, 68, 100, 4, WOOD_DARK);
  fillDisc(ctx, 96, 280, 5, BRASS);

  // Lampu gantung kiri atas.
  drawLine(ctx, 84, 0, 84, 34, INK, 3);
  fillPolygon(ctx, [[66, 34], [102, 34], [92, 58], [76, 58]], HONEY);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(66, 34);
  ctx.lineTo(102, 34);
  ctx.lineTo(92, 58);
  ctx.lineTo(76, 58);
  ctx.closePath();
  ctx.stroke();
  fillDisc(ctx, 84, 62, 5, '#FFF3C4');

  // Gambar kecil di dinding.
  fillRoundedRect(ctx, 148, 140, 54, 92, 4, CREAM);
  strokeRoundedRect(ctx, 148, 140, 54, 92, 4, INK, 2.5);
  fillDisc(ctx, 175, 168, 14, HONEY);
  fillPolygon(ctx, [[152, 228], [175, 196], [198, 228]], SAGE);

  drawWallClock(ctx, 240, 91, variant);
  drawTariffBoard(ctx);
  drawQueueBoard(ctx, variant);
  drawShelfRibbonParcel(ctx, variant);

  // Loket melintang.
  fillRoundedRect(ctx, 40, 250, 520, 52, 8, WOOD);
  strokeRoundedRect(ctx, 40, 250, 520, 52, 8, INK, 2.5);
  fillRoundedRect(ctx, 40, 250, 520, 12, 8, '#C08A5E');
  drawLine(ctx, 40, 282, 560, 282, WOOD_DARK, 2);
  // Lonceng di loket (hilang di panel kanan, dudukan tetap).
  if (variant === 0) drawServiceBell(ctx, 120, 278);
  else drawEmptyBellBase(ctx, 120, 278);
  // Tumpukan surat di loket.
  fillRoundedRect(ctx, 440, 262, 64, 10, 2, CREAM);
  strokeRoundedRect(ctx, 440, 262, 64, 10, 2, INK, 1.5);
  fillRoundedRect(ctx, 444, 252, 56, 10, 2, '#EFE3CC');
  strokeRoundedRect(ctx, 444, 252, 56, 10, 2, INK, 1.5);
  drawLine(ctx, 452, 257, 492, 257, TERRA, 2);

  // Karpet lantai.
  fillEllipse(ctx, 350, 452, 190, 16, '#E8C9A8');
  ctx.strokeStyle = TERRA;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(350, 452, 190, 16, 0, 0, Math.PI * 2);
  ctx.stroke();

  drawUmbrellaStand(ctx, variant);

  // Tumpukan paket kecil dekat pintu.
  fillRoundedRect(ctx, 118, 396, 52, 34, 4, '#D9B98A');
  strokeRoundedRect(ctx, 118, 396, 52, 34, 4, INK, 2);
  drawLine(ctx, 144, 396, 144, 430, TERRA, 4);
  fillRoundedRect(ctx, 126, 372, 36, 24, 4, SAGE);
  strokeRoundedRect(ctx, 126, 372, 36, 24, 4, INK, 2);

  // Koper awan (label kiri vs kanan pegangan).
  drawCloudSuitcase(ctx, 234, 394, variant === 0 ? -1 : 1);

  // Paket depan besar dengan perangko besar (bulan vs bintang).
  fillRoundedRect(ctx, 378, 330, 144, 102, 6, '#D9B98A');
  strokeRoundedRect(ctx, 378, 330, 144, 102, 6, INK, 2.5);
  fillRoundedRect(ctx, 378, 372, 144, 12, 0, '#C4A87E');
  drawMoonPostageStamp(ctx, 444, 374, 64, variant);
  drawLabelText(ctx, 'BULAN', 496, 416, 11, INK, 'center', 'bold');

  // Tanaman pot di kanan.
  fillRoundedRect(ctx, 552, 396, 34, 34, 4, TERRA);
  strokeRoundedRect(ctx, 552, 396, 34, 34, 4, INK, 2);
  fillEllipse(ctx, 569, 380, 8, 22, SAGE);
  fillEllipse(ctx, 556, 386, 7, 16, SAGE_DARK);
  fillEllipse(ctx, 582, 386, 7, 16, SAGE);

  drawPaperGrain(ctx, W, H, 1101);
  drawSceneFrame(ctx, W, H);
}

/* ------------------------------------------------------------------ */
/* Level 2 — Ruang Sortir Angin                                        */
/* ------------------------------------------------------------------ */

function drawIndicatorFan(ctx, cx, cy, variant) {
  fillDisc(ctx, cx, cy, 32, CREAM);
  strokeDisc(ctx, cx, cy, 32, INK, 3);
  // Kipas statis: bilah besar, hub jelas, tanpa garis gerak.
  const blades = variant === 0 ? 4 : 3;
  for (let i = 0; i < blades; i += 1) {
    const angle = (i * 2 * Math.PI) / blades - Math.PI / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -16, 8, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = TEAL;
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
  fillDisc(ctx, cx, cy, 9, BRASS);
  strokeDisc(ctx, cx, cy, 9, INK, 2);
}

function drawMachineLever(ctx, variant) {
  // Pangkal tetap; lengan miring kiri (asli) vs kanan (salinan).
  fillRoundedRect(ctx, 372, 240, 36, 28, 6, NAVY);
  strokeRoundedRect(ctx, 372, 240, 36, 28, 6, INK, 2);
  const tip = variant === 0 ? [345, 205] : [435, 205];
  drawLine(ctx, 390, 252, tip[0], tip[1], INK, 8);
  drawLine(ctx, 390, 252, tip[0], tip[1], WOOD, 4);
  fillDisc(ctx, tip[0], tip[1], 10, TERRA);
  strokeDisc(ctx, tip[0], tip[1], 10, INK, 2.5);
  fillDisc(ctx, 390, 252, 10, BRASS);
  strokeDisc(ctx, 390, 252, 10, INK, 2.5);
}

function drawBoot(ctx, x, soleY, shaftTopY, color) {
  // Sepatu bot pekerja: batang + kaki, sol di posisi yang sama.
  fillRoundedRect(ctx, x, shaftTopY, 26, soleY - shaftTopY, 4, color);
  strokeRoundedRect(ctx, x, shaftTopY, 26, soleY - shaftTopY, 4, INK, 2);
  fillRoundedRect(ctx, x, soleY - 14, 40, 14, 4, color);
  strokeRoundedRect(ctx, x, soleY - 14, 40, 14, 4, INK, 2);
  fillRoundedRect(ctx, x, soleY - 4, 40, 5, 2, WOOD_DARK);
  drawLine(ctx, x + 6, shaftTopY + 8, x + 20, shaftTopY + 8, INK, 1.5);
}

export function drawSortingRoomScene(ctx, variant) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#EAD9BE';
  ctx.fillRect(0, 400, W, 80);
  ctx.fillStyle = '#D9BE96';
  ctx.fillRect(0, 430, W, 50);
  drawLine(ctx, 0, 430, W, 430, INK, 2);

  // Pipa langit-langit.
  drawLine(ctx, 0, 26, W, 26, TEAL_DARK, 8);
  drawLine(ctx, 0, 40, W, 40, TEAL, 4);
  fillDisc(ctx, 520, 60, 12, HONEY);
  drawLine(ctx, 520, 40, 520, 50, INK, 3);

  // Rak kiri dengan laci-laci.
  fillRoundedRect(ctx, 24, 60, 152, 340, 6, WOOD);
  strokeRoundedRect(ctx, 24, 60, 152, 340, 6, INK, 2.5);
  for (const shelfY of [120, 200, 280, 340]) {
    fillRoundedRect(ctx, 30, shelfY, 140, 8, 2, WOOD_DARK);
  }
  // Kotak-kotak rak atas (tetap).
  fillRoundedRect(ctx, 36, 82, 58, 34, 4, '#D9B98A');
  strokeRoundedRect(ctx, 36, 82, 58, 34, 4, INK, 2);
  fillRoundedRect(ctx, 104, 82, 58, 34, 4, SAGE);
  strokeRoundedRect(ctx, 104, 82, 58, 34, 4, INK, 2);
  // Laci tengah dengan pegangan yang berubah: kenop bulat vs pegangan U besar.
  fillRoundedRect(ctx, 66, 176, 84, 60, 4, CREAM);
  strokeRoundedRect(ctx, 66, 176, 84, 60, 4, INK, 2.5);
  if (variant === 0) {
    fillDisc(ctx, 108, 206, 10, BRASS);
    strokeDisc(ctx, 108, 206, 10, INK, 2.5);
  } else {
    ctx.beginPath();
    ctx.moveTo(88, 196);
    ctx.lineTo(88, 214);
    ctx.quadraticCurveTo(88, 226, 108, 226);
    ctx.quadraticCurveTo(128, 226, 128, 214);
    ctx.lineTo(128, 196);
    ctx.strokeStyle = BRASS;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(88, 196);
    ctx.lineTo(88, 214);
    ctx.quadraticCurveTo(88, 226, 108, 226);
    ctx.quadraticCurveTo(128, 226, 128, 214);
    ctx.lineTo(128, 196);
    ctx.stroke();
  }
  // Laci bawah (tetap).
  fillRoundedRect(ctx, 66, 292, 84, 44, 4, '#D9B98A');
  strokeRoundedRect(ctx, 66, 292, 84, 44, 4, INK, 2);
  fillDisc(ctx, 108, 314, 7, INK);

  // Poster kecil.
  fillRoundedRect(ctx, 188, 76, 44, 62, 4, CREAM);
  strokeRoundedRect(ctx, 188, 76, 44, 62, 4, INK, 2);
  drawLabelText(ctx, 'SORTIR', 210, 92, 9, INK, 'center', 'bold');
  drawLine(ctx, 198, 106, 222, 106, TEAL, 3);
  drawLine(ctx, 198, 116, 222, 116, TERRA, 3);
  drawLine(ctx, 198, 126, 214, 126, HONEY, 3);

  // Mesin sortir tengah.
  fillRoundedRect(ctx, 240, 90, 200, 190, 12, TEAL);
  strokeRoundedRect(ctx, 240, 90, 200, 190, 12, INK, 3);
  fillRoundedRect(ctx, 240, 90, 200, 26, 12, TEAL_DARK);
  drawLabelText(ctx, 'SORTIR ANGIN', 340, 104, 13, CREAM, 'center', 'bold');
  drawIndicatorFan(ctx, 306, 150, variant);
  // Pengukur kecil (tetap).
  fillDisc(ctx, 392, 134, 16, CREAM);
  strokeDisc(ctx, 392, 134, 16, INK, 2.5);
  drawLine(ctx, 392, 134, 402, 122, TERRA, 3);
  fillDisc(ctx, 392, 134, 3, INK);
  // Tombol-tombol mesin (tetap).
  fillDisc(ctx, 268, 262, 8, HONEY);
  fillDisc(ctx, 292, 262, 8, TERRA);
  fillDisc(ctx, 316, 262, 8, SAGE);
  drawMachineLever(ctx, variant);

  // Ban berjalan + paket bergaris.
  fillRoundedRect(ctx, 170, 310, 260, 56, 10, NAVY);
  strokeRoundedRect(ctx, 170, 310, 260, 56, 10, INK, 2.5);
  fillDisc(ctx, 186, 338, 12, INK);
  fillDisc(ctx, 414, 338, 12, INK);
  fillDisc(ctx, 186, 338, 5, '#8A93A3');
  fillDisc(ctx, 414, 338, 5, '#8A93A3');
  // Paket di ban: pita horizontal tetap; pita vertikal lebar hilang di kanan.
  fillRoundedRect(ctx, 168, 298, 84, 66, 4, '#D9B98A');
  strokeRoundedRect(ctx, 168, 298, 84, 66, 4, INK, 2.5);
  fillRoundedRect(ctx, 168, 322, 84, 12, 0, TERRA);
  if (variant === 0) {
    fillRoundedRect(ctx, 202, 298, 16, 66, 0, TERRA);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(202, 298, 16, 66);
  }

  // Tabung kaca kanan dengan kapsul surat.
  fillRoundedRect(ctx, 470, 108, 56, 164, 14, 'rgba(255,248,236,0.55)');
  strokeRoundedRect(ctx, 470, 108, 56, 164, 14, INK, 2.5);
  drawLine(ctx, 470, 140, 526, 140, INK, 1.5);
  drawLine(ctx, 470, 200, 526, 200, INK, 1.5);
  const capsuleYs = variant === 0 ? [128, 176] : [122, 168, 224];
  for (const cy of capsuleYs) {
    fillRoundedRect(ctx, 480, cy, 36, 26, 8, CREAM);
    strokeRoundedRect(ctx, 480, cy, 36, 26, 8, INK, 2);
    drawLine(ctx, 486, cy + 13, 510, cy + 13, TERRA, 2);
  }
  fillRoundedRect(ctx, 466, 96, 64, 14, 6, BRASS);
  strokeRoundedRect(ctx, 466, 96, 64, 14, 6, INK, 2);
  fillRoundedRect(ctx, 466, 270, 64, 12, 6, WOOD_DARK);

  // Bangku + sepatu bot pekerja di bawahnya.
  fillRoundedRect(ctx, 28, 372, 132, 12, 4, WOOD);
  strokeRoundedRect(ctx, 28, 372, 132, 12, 4, INK, 2);
  fillRoundedRect(ctx, 34, 384, 8, 46, 2, WOOD_DARK);
  fillRoundedRect(ctx, 146, 384, 8, 46, 2, WOOD_DARK);
  drawBoot(ctx, 48, 430, 386, WOOD_DARK);
  // Satu bot tumbuh lebih tinggi di panel kanan; sol tetap di tempat.
  drawBoot(ctx, 92, 430, variant === 0 ? 386 : 370, TERRA);

  // Meja kanan bawah + amplop bersegel.
  fillRoundedRect(ctx, 350, 350, 220, 12, 4, WOOD);
  strokeRoundedRect(ctx, 350, 350, 220, 12, 4, INK, 2);
  fillRoundedRect(ctx, 360, 362, 10, 68, 2, WOOD_DARK);
  fillRoundedRect(ctx, 550, 362, 10, 68, 2, WOOD_DARK);
  fillRoundedRect(ctx, 348, 356, 84, 46, 3, CREAM);
  strokeRoundedRect(ctx, 348, 356, 84, 46, 3, INK, 2);
  drawLine(ctx, 348, 356, 390, 382, INK, 1.5);
  drawLine(ctx, 432, 356, 390, 382, INK, 1.5);
  if (variant === 0) {
    // Segel merah bersilang.
    fillDisc(ctx, 390, 379, 11, '#C0392B');
    strokeDisc(ctx, 390, 379, 11, INK, 2);
    drawLine(ctx, 383, 372, 397, 386, CREAM, 2.5);
    drawLine(ctx, 397, 372, 383, 386, CREAM, 2.5);
  } else {
    // Segel teal bercincin.
    strokeDisc(ctx, 390, 379, 12, TEAL, 4);
    fillDisc(ctx, 390, 379, 4, TEAL);
  }
  // Peti di bawah meja (tetap).
  fillRoundedRect(ctx, 480, 384, 76, 46, 4, '#D9B98A');
  strokeRoundedRect(ctx, 480, 384, 76, 46, 4, INK, 2);
  drawLine(ctx, 480, 407, 556, 407, INK, 2);

  // Amplop berserakan di lantai (tetap).
  fillRoundedRect(ctx, 240, 428, 34, 20, 2, CREAM);
  ctx.save();
  ctx.translate(257, 438);
  ctx.rotate(-0.2);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-17, -10, 34, 20);
  ctx.restore();

  drawPaperGrain(ctx, W, H, 2202);
  drawSceneFrame(ctx, W, H);
}

/* ------------------------------------------------------------------ */
/* Level 3 — Rumah Kaca Pengiriman Malam                               */
/* ------------------------------------------------------------------ */

function drawLantern(ctx, variant) {
  drawLine(ctx, 144, 0, 144, 82, INK, 3);
  fillDisc(ctx, 144, 110, 42, 'rgba(232,188,89,0.22)');
  if (variant === 0) {
    // Pelindung segi enam.
    const pts = [];
    for (let i = 0; i < 6; i += 1) {
      const a = (i * Math.PI) / 3 - Math.PI / 2;
      pts.push([144 + Math.cos(a) * 26, 110 + Math.sin(a) * 26]);
    }
    fillPolygon(ctx, pts, HONEY);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.stroke();
  } else {
    // Pelindung bulat.
    fillDisc(ctx, 144, 110, 26, HONEY);
    strokeDisc(ctx, 144, 110, 26, INK, 2.5);
  }
  fillRoundedRect(ctx, 140, 100, 8, 14, 2, CREAM);
  fillDisc(ctx, 144, 98, 4, '#FF8A3D');
}

function drawEnvelopeLeaf(ctx, x, y, angle, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  fillRoundedRect(ctx, -size / 2, -size * 0.36, size, size * 0.72, 3, CREAM);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.strokeRect(-size / 2, -size * 0.36, size, size * 0.72);
  ctx.beginPath();
  ctx.moveTo(-size / 2, -size * 0.36);
  ctx.lineTo(0, size * 0.1);
  ctx.lineTo(size / 2, -size * 0.36);
  ctx.stroke();
  ctx.restore();
}

function drawPotEmblem(ctx, cx, cy, variant) {
  if (variant === 0) {
    // Emblem tetes.
    ctx.beginPath();
    ctx.moveTo(cx, cy - 12);
    ctx.quadraticCurveTo(cx + 10, cy + 2, cx, cy + 10);
    ctx.quadraticCurveTo(cx - 10, cy + 2, cx, cy - 12);
    ctx.closePath();
    ctx.fillStyle = TEAL;
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    // Tiga gelombang besar.
    ctx.strokeStyle = HONEY;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.arc(cx + i * 11, cy + 4, 6, Math.PI, Math.PI * 2);
      ctx.stroke();
    }
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5;
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.arc(cx + i * 11, cy + 4, 6, Math.PI, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawWateringCan(ctx, variant) {
  // Kaleng penyiram terpisah dari pot tengah; cerat ke bawah vs ke atas.
  fillRoundedRect(ctx, 222, 348, 70, 54, 10, TEAL);
  strokeRoundedRect(ctx, 222, 348, 70, 54, 10, INK, 2.5);
  drawLine(ctx, 222, 368, 292, 368, TEAL_DARK, 3);
  // Pegangan kiri.
  ctx.beginPath();
  ctx.arc(222, 375, 16, Math.PI * 0.5, Math.PI * 1.5);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.stroke();
  // Cerat kanan.
  ctx.beginPath();
  ctx.moveTo(292, 362);
  if (variant === 0) ctx.quadraticCurveTo(312, 366, 306, 384);
  else ctx.quadraticCurveTo(312, 356, 306, 344);
  ctx.strokeStyle = TEAL;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(292, 362);
  if (variant === 0) ctx.quadraticCurveTo(312, 366, 306, 384);
  else ctx.quadraticCurveTo(312, 356, 306, 344);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.stroke();
  const tip = variant === 0 ? [306, 386] : [306, 342];
  fillDisc(ctx, tip[0], tip[1], 6, BRASS);
  strokeDisc(ctx, tip[0], tip[1], 6, INK, 2);
}

function drawSpool(ctx, cx, cy, variant) {
  // Gulungan tali besar; lubang pusat 12 (kiri) vs 24 (kanan) unit.
  fillDisc(ctx, cx, cy, 34, HONEY);
  strokeDisc(ctx, cx, cy, 34, INK, 2.5);
  ctx.strokeStyle = '#B98A2F';
  ctx.lineWidth = 2;
  for (const r of [28, 22, 16]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  drawLine(ctx, cx - 30, cy - 14, cx + 30, cy + 10, '#B98A2F', 2);
  drawLine(ctx, cx - 28, cy + 16, cx + 28, cy - 12, '#B98A2F', 2);
  fillDisc(ctx, cx, cy, variant === 0 ? 6 : 12, INK);
  strokeDisc(ctx, cx, cy, variant === 0 ? 6 : 12, '#5A4632', 1.5);
}

function drawCratePlate(ctx, variant) {
  // Pelat peti: zigzag terakota vs titik navy — beda dari payung L1-3.
  fillRoundedRect(ctx, 120, 394, 56, 36, 3, variant === 0 ? TERRA : NAVY);
  strokeRoundedRect(ctx, 120, 394, 56, 36, 3, INK, 2);
  if (variant === 0) {
    ctx.strokeStyle = CREAM;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(126, 424);
    ctx.lineTo(134, 400);
    ctx.lineTo(142, 424);
    ctx.lineTo(150, 400);
    ctx.lineTo(158, 424);
    ctx.lineTo(166, 400);
    ctx.lineTo(170, 412);
    ctx.stroke();
  } else {
    ctx.fillStyle = CREAM;
    for (const [dx, dy] of [[0, 0], [16, 0], [32, 0], [8, 12], [24, 12], [40, 12], [0, 24], [16, 24], [32, 24]]) {
      fillDisc(ctx, 130 + dx, 402 + dy, 3.2, CREAM);
    }
  }
}

export function drawNightGreenhouseScene(ctx, variant) {
  // Langit malam + atap kaca.
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#2A3C57';
  ctx.fillRect(0, 0, W, 150);
  const stars = mulberry32(3303);
  for (let i = 0; i < 70; i += 1) {
    const x = stars() * W;
    const y = stars() * 170;
    fillDisc(ctx, x, y, 0.8 + stars() * 1.4, stars() > 0.85 ? HONEY : CREAM);
  }
  // Bulan.
  fillDisc(ctx, 520, 66, 26, CREAM);
  fillDisc(ctx, 512, 58, 5, '#E3D3AE');
  fillDisc(ctx, 528, 74, 4, '#E3D3AE');
  fillDisc(ctx, 524, 56, 3, '#E3D3AE');
  // Rangka atap kaca.
  ctx.strokeStyle = 'rgba(245,235,221,0.5)';
  ctx.lineWidth = 3;
  for (const x of [150, 300, 450]) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 190);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, 60);
  ctx.quadraticCurveTo(300, 110, 600, 60);
  ctx.stroke();
  // Lantai batu.
  ctx.fillStyle = '#3D5478';
  ctx.fillRect(0, 430, W, 50);
  drawLine(ctx, 0, 430, W, 430, INK, 2);
  for (let i = 0; i < 8; i += 1) drawLine(ctx, i * 80, 430, i * 80 + 30, 480, '#33465F', 1.5);

  drawLantern(ctx, variant);

  // Tanaman amplop kiri: satu daun besar hilang di panel kanan.
  fillRoundedRect(ctx, 48, 402, 60, 44, 6, TERRA);
  strokeRoundedRect(ctx, 48, 402, 60, 44, 6, INK, 2.5);
  drawLine(ctx, 78, 402, 78, 300, SAGE_DARK, 4);
  drawLine(ctx, 78, 360, 60, 330, SAGE_DARK, 3);
  drawLine(ctx, 78, 340, 100, 310, SAGE_DARK, 3);
  drawEnvelopeLeaf(ctx, 56, 322, -0.5, 34);
  drawEnvelopeLeaf(ctx, 102, 306, 0.4, 30);
  drawEnvelopeLeaf(ctx, 78, 240, 0.1, 30);
  if (variant === 0) drawEnvelopeLeaf(ctx, 90, 274, -0.15, 52);

  // Pot tengah + tanaman di atasnya.
  drawLine(ctx, 294, 196, 294, 120, SAGE_DARK, 4);
  drawLine(ctx, 294, 160, 268, 132, SAGE_DARK, 3);
  drawLine(ctx, 294, 150, 322, 126, SAGE_DARK, 3);
  fillEllipse(ctx, 262, 128, 10, 20, SAGE);
  fillEllipse(ctx, 326, 122, 10, 20, SAGE);
  fillEllipse(ctx, 294, 108, 9, 18, SAGE_DARK);
  ctx.beginPath();
  ctx.moveTo(252, 196);
  ctx.lineTo(336, 196);
  ctx.lineTo(326, 258);
  ctx.lineTo(262, 258);
  ctx.closePath();
  ctx.fillStyle = TERRA;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  fillRoundedRect(ctx, 248, 190, 92, 14, 4, '#A85A3E');
  strokeRoundedRect(ctx, 248, 190, 92, 14, 4, INK, 2);
  drawPotEmblem(ctx, 294, 226, variant);

  // Jendela kanan + batang polos + kait kontras.
  fillRoundedRect(ctx, 460, 160, 120, 110, 6, '#22344E');
  strokeRoundedRect(ctx, 460, 160, 120, 110, 6, INK, 2.5);
  drawLine(ctx, 520, 160, 520, 270, INK, 2);
  drawLine(ctx, 460, 215, 580, 215, INK, 2);
  fillDisc(ctx, 490, 188, 3, CREAM);
  fillDisc(ctx, 548, 240, 3, CREAM);
  drawLine(ctx, 455, 139, 582, 139, INK, 5);
  // Kait: kiri (480) vs kanan (552) — dua posisi berjauhan.
  const hookX = variant === 0 ? 480 : 552;
  ctx.beginPath();
  ctx.arc(hookX, 139, 9, Math.PI * 0.15, Math.PI * 1.35);
  ctx.strokeStyle = CORAL;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.stroke();
  fillDisc(ctx, hookX, 130, 4, CORAL);

  // Meja kanan + gulungan tali.
  fillRoundedRect(ctx, 380, 300, 190, 12, 4, WOOD);
  strokeRoundedRect(ctx, 380, 300, 190, 12, 4, INK, 2);
  fillRoundedRect(ctx, 390, 312, 10, 118, 2, WOOD_DARK);
  fillRoundedRect(ctx, 550, 312, 10, 118, 2, WOOD_DARK);
  drawSpool(ctx, 432, 326, variant);
  // Toples di meja (tetap).
  fillRoundedRect(ctx, 500, 268, 30, 34, 6, 'rgba(245,235,221,0.8)');
  strokeRoundedRect(ctx, 500, 268, 30, 34, 6, INK, 2);
  fillDisc(ctx, 515, 286, 6, HONEY);

  drawWateringCan(ctx, variant);

  // Peti kiri bawah + pelat pengiriman.
  fillRoundedRect(ctx, 110, 374, 76, 78, 4, WOOD);
  strokeRoundedRect(ctx, 110, 374, 76, 78, 4, INK, 2.5);
  drawLine(ctx, 110, 400, 186, 400, WOOD_DARK, 2);
  drawLine(ctx, 110, 426, 186, 426, WOOD_DARK, 2);
  drawLine(ctx, 148, 374, 148, 452, WOOD_DARK, 2);
  drawCratePlate(ctx, variant);

  // Kunang-kunang (tetap).
  const flies = mulberry32(3304);
  for (let i = 0; i < 14; i += 1) {
    fillDisc(ctx, 200 + flies() * 360, 300 + flies() * 120, 1.8, HONEY);
  }

  drawPaperGrain(ctx, W, H, 3303);
  drawSceneFrame(ctx, W, H);
}
