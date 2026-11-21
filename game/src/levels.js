// levels.js — definisi 21 perbedaan manual untuk tiga scene progresif.
// Satu perbedaan = satu objek semantik: id, label, petunjuk, zona klik (lingkaran
// dalam koordinat logis 600x480 per panel) dan pusat marker tiap panel. Zona klik
// minimum ~32 unit; perubahan posisi menerima klik di lokasi lama MAUPUN baru;
// zona dua perbedaan tidak pernah bertumpuk (diperiksa validateDifferenceDefinitions).
//
// Perbaikan review Codex yang sudah diterapkan di sini:
//  L1-4 lubang gantungan -> tab nomor besar 2->3; L1-2 perangko diperbesar;
//  L1-6 jarum panjang dibedakan panjang/tebalnya; L2-5 kenop -> pegangan U besar;
//  L3-4 bulan->matahari diganti tetes->tiga gelombang; L3-5 lubang 12->24;
//  L3-7 pola peti dibuat beda dari payung L1-3; L1-5 label kiri/kanan tegas.

export const PANEL_WIDTH = 600;
export const PANEL_HEIGHT = 480;

function difference(id, label, hint, zones, marker, markerRight) {
  return {
    id,
    label,
    hint,
    zones,
    marker,
    // Marker panel kanan; bila tidak diisi, sama dengan marker panel kiri.
    markerRight: markerRight || marker,
  };
}

function levelOneDifferences() {
  return [
    difference(
      'bell', 'Lonceng loket', 'Di atas loket, ada yang biasa berdenting.',
      [{ x: 120, y: 274, r: 30 }],
      { x: 120, y: 274, r: 34 },
    ),
    difference(
      'stamp', 'Perangko paket depan', 'Perangko besar di paket depan berubah gambar.',
      [{ x: 444, y: 374, r: 36 }],
      { x: 444, y: 374, r: 42 },
    ),
    difference(
      'umbrella', 'Payung di wadah pintu', 'Payung dekat pintu berganti kain.',
      [{ x: 60, y: 346, r: 32 }],
      { x: 60, y: 346, r: 38 },
    ),
    difference(
      'number-tabs', 'Tab nomor antrean', 'Di bawah papan antrean, jumlah tab nomornya beda.',
      [{ x: 468, y: 135, r: 44 }],
      { x: 468, y: 135, r: 50 },
    ),
    difference(
      'suitcase-label', 'Label koper awan', 'Label koper pindah sisi pegangan.',
      [{ x: 196, y: 398, r: 24 }, { x: 274, y: 398, r: 24 }],
      { x: 196, y: 398, r: 28 },
      { x: 274, y: 398, r: 28 },
    ),
    difference(
      'clock-hands', 'Jarum jam dinding', 'Jam dinding menunjuk jam yang berbeda.',
      [{ x: 240, y: 91, r: 36 }],
      { x: 240, y: 91, r: 40 },
    ),
    difference(
      'ribbon-fork', 'Pita paket di rak', 'Ujung pita yang menjuntai bercabang.',
      [{ x: 348, y: 202, r: 30 }],
      { x: 348, y: 202, r: 36 },
    ),
  ];
}

function levelTwoDifferences() {
  return [
    difference(
      'fan-blades', 'Kincir indikator mesin', 'Kincir di mesin kehilangan satu bilah.',
      [{ x: 306, y: 150, r: 36 }],
      { x: 306, y: 150, r: 42 },
    ),
    difference(
      'vertical-ribbon', 'Pita vertikal paket', 'Pita tegak di paket ban berjalan hilang.',
      [{ x: 210, y: 331, r: 34 }],
      { x: 210, y: 331, r: 40 },
    ),
    difference(
      'capsule', 'Kapsul di tabung kaca', 'Di tabung kanan ada satu kapsul surat tambahan.',
      [{ x: 498, y: 178, r: 32 }],
      { x: 498, y: 178, r: 38 },
    ),
    difference(
      'boot-height', 'Sepatu bot pekerja', 'Satu bot di bawah bangku tumbuh lebih tinggi.',
      [{ x: 78, y: 400, r: 38 }],
      { x: 78, y: 400, r: 44 },
    ),
    difference(
      'drawer-handle', 'Pegangan laci rak', 'Pegangan laci berubah bentuk total.',
      [{ x: 108, y: 206, r: 30 }],
      { x: 108, y: 206, r: 36 },
    ),
    difference(
      'envelope-seal', 'Segel amplop di meja', 'Segel amplop berganti warna dan simbol.',
      [{ x: 390, y: 379, r: 30 }],
      { x: 390, y: 379, r: 36 },
    ),
    difference(
      'lever-tilt', 'Tuas besar mesin', 'Tuas mesin miring ke arah berlawanan.',
      [{ x: 345, y: 205, r: 26 }, { x: 390, y: 252, r: 22 }, { x: 435, y: 205, r: 26 }],
      { x: 390, y: 230, r: 44 },
    ),
  ];
}

function levelThreeDifferences() {
  return [
    difference(
      'lantern-shade', 'Lentera gantung', 'Pelindung lentera berubah bentuk.',
      [{ x: 144, y: 110, r: 32 }],
      { x: 144, y: 110, r: 38 },
    ),
    difference(
      'envelope-leaf', 'Daun amplop tanaman', 'Satu daun amplop besar di tanaman kiri hilang.',
      [{ x: 90, y: 274, r: 30 }],
      { x: 90, y: 274, r: 36 },
    ),
    difference(
      'watering-spout', 'Cerat kaleng penyiram', 'Cerat kaleng melengkung ke arah berlawanan.',
      [{ x: 258, y: 372, r: 26 }, { x: 302, y: 348, r: 22 }, { x: 302, y: 380, r: 22 }],
      { x: 268, y: 368, r: 42 },
    ),
    difference(
      'pot-emblem', 'Emblem pot tengah', 'Lambang di pot tengah berganti gambar.',
      [{ x: 294, y: 226, r: 30 }],
      { x: 294, y: 226, r: 36 },
    ),
    difference(
      'spool-hole', 'Lubang gulungan tali', 'Lubang tengah gulungan membesar jelas.',
      [{ x: 432, y: 326, r: 36 }],
      { x: 432, y: 326, r: 42 },
    ),
    difference(
      'window-hook', 'Kait penyangga jendela', 'Kait di batang jendela pindah jauh.',
      [{ x: 480, y: 139, r: 20 }, { x: 552, y: 139, r: 20 }],
      { x: 480, y: 139, r: 26 },
      { x: 552, y: 139, r: 26 },
    ),
    difference(
      'crate-plate', 'Pelat peti kiri bawah', 'Pelat pengiriman di peti berganti pola.',
      [{ x: 144, y: 413, r: 32 }],
      { x: 144, y: 413, r: 38 },
    ),
  ];
}

/**
 * Tiga level progresif: kesulitan naik lewat kepadatan scene dan kemiripan
 * bentuk, bukan dengan mengecilkan target. Waktu makin ketat tiap level.
 */
export function createThreeProgressiveLevels() {
  return [
    {
      id: 'intake-counter',
      index: 0,
      name: 'Loket Kiriman Mustahil',
      place: 'Loket penerimaan',
      timeLimitSeconds: 180,
      differences: levelOneDifferences(),
    },
    {
      id: 'sorting-room',
      index: 1,
      name: 'Ruang Sortir Angin',
      place: 'Ruang sortir',
      timeLimitSeconds: 165,
      differences: levelTwoDifferences(),
    },
    {
      id: 'night-greenhouse',
      index: 2,
      name: 'Rumah Kaca Pengiriman Malam',
      place: 'Rumah kaca malam',
      timeLimitSeconds: 150,
      differences: levelThreeDifferences(),
    },
  ];
}
