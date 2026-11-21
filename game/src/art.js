// art.js — primitif ilustrasi orisinal bersama untuk ketiga scene.
// Semua gambar digambar prosedural di Canvas: tanpa aset eksternal, tanpa network.
// Palet diorama "Biro Barang Tersesat": kertas krem, tinta, terakota, teal, madu, sage.

export const PAPER = '#F5EBDD';
export const CREAM = '#FFF8EC';
export const INK = '#263946';
export const TERRA = '#BE7052';
export const TEAL = '#397F82';
export const TEAL_DARK = '#2A5F62';
export const HONEY = '#E8BC59';
export const SAGE = '#819878';
export const SAGE_DARK = '#5F7A5E';
export const NIGHT = '#344A68';
export const NAVY = '#2E4057';
export const CORAL = '#EF705D';
export const WOOD = '#A9714B';
export const WOOD_DARK = '#7E5233';
export const BRASS = '#C9A227';
export const ROSE = '#D97B6C';

/** Deterministic PRNG (mulberry32) supaya tekstur kertas identik di kedua panel. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function nextRandom() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Jalur persegi membulat (x, y = sudut kiri atas). */
export function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export function fillRoundedRect(ctx, x, y, width, height, radius, color) {
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = color;
  ctx.fill();
}

export function strokeRoundedRect(ctx, x, y, width, height, radius, color, widthPx) {
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.strokeStyle = color;
  ctx.lineWidth = widthPx;
  ctx.stroke();
}

export function fillDisc(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function strokeDisc(ctx, x, y, radius, color, widthPx) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = widthPx;
  ctx.stroke();
}

export function fillEllipse(ctx, x, y, radiusX, radiusY, color) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawLine(ctx, x1, y1, x2, y2, color, widthPx) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = widthPx;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function fillPolygon(ctx, points, color) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawLabelText(ctx, text, x, y, size, color, align, weight) {
  ctx.font = `${weight || 'bold'} ${size}px Georgia, 'Times New Roman', serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

export function outlineShape(ctx, color, widthPx) {
  ctx.strokeStyle = color;
  ctx.lineWidth = widthPx;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

/** Bintik kertas sangat tipis, deterministik — sama persis di panel kiri dan kanan. */
export function drawPaperGrain(ctx, width, height, seed) {
  const rand = mulberry32(seed);
  ctx.save();
  for (let i = 0; i < 260; i += 1) {
    const x = rand() * width;
    const y = rand() * height;
    const r = 0.6 + rand() * 1.1;
    ctx.globalAlpha = 0.05 + rand() * 0.05;
    ctx.fillStyle = rand() > 0.5 ? INK : '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Garis tepi panel: garis tinta tipis membingkai area gambar. */
export function drawSceneFrame(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, width - 3, height - 3);
  ctx.restore();
}

/**
 * Perangko bulan besar di atas bidang parcel polos (L1-2): bulan sabit krem di
 * bidang madu bergaris tepi, atau bintang lima di bidang yang sama.
 */
export function drawMoonPostageStamp(ctx, cx, cy, size, variant) {
  const half = size / 2;
  fillRoundedRect(ctx, cx - half, cy - half, size, size, 6, HONEY);
  strokeRoundedRect(ctx, cx - half, cy - half, size, size, 6, INK, 2.5);
  // Gerigi perangko: titik-titik kecil di keempat sisi.
  ctx.fillStyle = PAPER;
  for (let i = 0; i < 5; i += 1) {
    const t = -half + 10 + i * ((size - 20) / 4);
    fillDisc(ctx, cx + t, cy - half + 2, 2.2, PAPER);
    fillDisc(ctx, cx + t, cy + half - 2, 2.2, PAPER);
    fillDisc(ctx, cx - half + 2, cy + t, 2.2, PAPER);
    fillDisc(ctx, cx + half - 2, cy + t, 2.2, PAPER);
  }
  if (variant === 0) {
    // Bulan sabit: dua lingkaran bertumpuk.
    fillDisc(ctx, cx - 3, cy, size * 0.26, CREAM);
    fillDisc(ctx, cx + 7, cy - 4, size * 0.22, HONEY);
    fillDisc(ctx, cx - size * 0.3, cy - size * 0.26, 2.5, CREAM);
    fillDisc(ctx, cx + size * 0.28, cy + size * 0.3, 2.5, CREAM);
  } else {
    // Bintang lima: poligon bintang.
    const points = [];
    const outer = size * 0.27;
    const inner = size * 0.11;
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const radius = i % 2 === 0 ? outer : inner;
      points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
    }
    fillPolygon(ctx, points, CREAM);
  }
}

/**
 * Koper awan (L1-5): koper teal dengan gumpalan awan keluar dari tutupnya,
 * pegangan di tengah atas, label kertas menempel di kiri atau kanan pegangan.
 */
export function drawCloudSuitcase(ctx, cx, cy, labelSide) {
  const w = 118;
  const h = 74;
  const x = cx - w / 2;
  const y = cy - h / 2;
  // Awan keluar dari tutup koper.
  ctx.fillStyle = CREAM;
  fillDisc(ctx, cx - 26, y - 6, 16, CREAM);
  fillDisc(ctx, cx - 4, y - 14, 20, CREAM);
  fillDisc(ctx, cx + 20, y - 8, 15, CREAM);
  fillDisc(ctx, cx + 38, y + 2, 10, CREAM);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx - 26, y - 6, 16, Math.PI * 0.9, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx - 4, y - 14, 20, Math.PI, Math.PI * 1.95);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + 20, y - 8, 15, Math.PI * 1.1, Math.PI * 1.95);
  ctx.stroke();
  // Badan koper.
  fillRoundedRect(ctx, x, y, w, h, 10, TEAL);
  strokeRoundedRect(ctx, x, y, w, h, 10, INK, 2.5);
  drawLine(ctx, x, y + h / 2, x + w, y + h / 2, TEAL_DARK, 3);
  fillRoundedRect(ctx, x + 8, y + 10, 10, h - 20, 4, TEAL_DARK);
  fillRoundedRect(ctx, x + w - 18, y + 10, 10, h - 20, 4, TEAL_DARK);
  // Pegangan.
  strokeRoundedRect(ctx, cx - 16, y - 12, 32, 16, 6, INK, 4);
  // Label kertas: kiri (-1) atau kanan (+1) pegangan, dengan ruang kosong tegas.
  const labelX = labelSide < 0 ? cx - 44 : cx + 22;
  fillRoundedRect(ctx, labelX, y + 16, 24, 30, 3, CREAM);
  strokeRoundedRect(ctx, labelX, y + 16, 24, 30, 3, INK, 2);
  drawLine(ctx, labelX + 5, y + 26, labelX + 19, y + 26, TERRA, 2.5);
  drawLine(ctx, labelX + 5, y + 33, labelX + 19, y + 33, INK, 2);
  drawLine(ctx, labelX + 5, y + 40, labelX + 14, y + 40, INK, 2);
}

/** Lonceng kuningan di atas dudukan kayu (L1-1). */
export function drawServiceBell(ctx, cx, baseY) {
  fillRoundedRect(ctx, cx - 24, baseY - 4, 48, 8, 4, WOOD_DARK);
  ctx.beginPath();
  ctx.moveTo(cx - 18, baseY - 4);
  ctx.quadraticCurveTo(cx - 20, baseY - 30, cx, baseY - 32);
  ctx.quadraticCurveTo(cx + 20, baseY - 30, cx + 18, baseY - 4);
  ctx.closePath();
  ctx.fillStyle = BRASS;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  fillDisc(ctx, cx, baseY - 34, 4, INK);
  drawLine(ctx, cx - 18, baseY - 6, cx + 18, baseY - 6, '#8A6D1F', 2);
}

/** Dudukan lonceng saja (tanpa lonceng) — dipakai panel kanan L1-1. */
export function drawEmptyBellBase(ctx, cx, baseY) {
  fillRoundedRect(ctx, cx - 24, baseY - 4, 48, 8, 4, WOOD_DARK);
  strokeRoundedRect(ctx, cx - 24, baseY - 4, 48, 8, 4, INK, 2);
  fillDisc(ctx, cx, baseY - 8, 3, INK);
}
