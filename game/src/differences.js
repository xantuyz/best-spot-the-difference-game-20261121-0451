// differences.js — hit testing klik dan validasi definisi perbedaan.
// Satu klik hanya menemukan satu perbedaan; zona yang sudah ditemukan tidak
// menghalangi target lain dan tidak pernah dihukum bila diklik lagi.

/** Jarak dua titik dalam koordinat logis panel. */
export function distanceBetween(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function pointInsideZone(x, y, zone) {
  return distanceBetween(x, y, zone.x, zone.y) <= zone.r;
}

/**
 * Cari perbedaan yang belum ditemukan di titik (x, y). Mengembalikan definisi
 * perbedaan itu, atau null bila tidak ada. Zona milik perbedaan yang sudah
 * ditemukan dilewati di sini — pemanggil memeriksa zona selesai secara terpisah
 * supaya klik ulang tidak dihitung salah.
 */
export function findDifferenceAtPoint(level, foundIds, x, y) {
  for (const diff of level.differences) {
    if (foundIds.has(diff.id)) continue;
    for (const zone of diff.zones) {
      if (pointInsideZone(x, y, zone)) return diff;
    }
  }
  return null;
}

/** True bila titik jatuh di zona perbedaan yang SUDAH ditemukan (klik ulang aman). */
export function pointHitsFoundDifference(level, foundIds, x, y) {
  for (const diff of level.differences) {
    if (!foundIds.has(diff.id)) continue;
    for (const zone of diff.zones) {
      if (pointInsideZone(x, y, zone)) return diff;
    }
  }
  return null;
}

/**
 * Validasi definisi level: tepat 7 perbedaan, tiap zona >= 16 unit radius
 * (target utama 24-60), dan tidak ada zona dua perbedaan berbeda yang
 * bertumpuk (jarak pusat > jumlah radius + 4). Mengembalikan daftar masalah;
 * kosong berarti lolos.
 */
export function validateDifferenceDefinitions(levels) {
  const problems = [];
  for (const level of levels) {
    if (level.differences.length !== 7) {
      problems.push(`${level.id}: ${level.differences.length} perbedaan, harus 7`);
    }
    for (let i = 0; i < level.differences.length; i += 1) {
      const a = level.differences[i];
      for (const zone of a.zones) {
        if (zone.r < 16) problems.push(`${level.id}/${a.id}: zona r=${zone.r} terlalu kecil`);
        if (zone.x < 0 || zone.x > 600 || zone.y < 0 || zone.y > 480) {
          problems.push(`${level.id}/${a.id}: zona di luar panel (${zone.x},${zone.y})`);
        }
      }
      for (let j = i + 1; j < level.differences.length; j += 1) {
        const b = level.differences[j];
        for (const za of a.zones) {
          for (const zb of b.zones) {
            const gap = distanceBetween(za.x, za.y, zb.x, zb.y) - (za.r + zb.r);
            if (gap < 4) {
              problems.push(`${level.id}: zona ${a.id} dan ${b.id} bertumpuk (celah ${gap.toFixed(1)})`);
            }
          }
        }
      }
    }
  }
  return problems;
}
