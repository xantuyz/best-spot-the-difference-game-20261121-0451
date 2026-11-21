# Biro Barang Tersesat — Cari 7 Perbedaan

Game spot-the-difference orisinal: kamu jadi pemeriksa di biro pos fantasi yang
mengurus kiriman mustahil. Bandingkan **Arsip Asli** dengan **Salinan Ganjil** di
tiga ruangan — Loket Kiriman Mustahil, Ruang Sortir Angin, dan Rumah Kaca
Pengiriman Malam — dan temukan 7 perbedaan di tiap level (21 total).

## Cara main

- Klik perbedaan di panel kiri **atau** kanan — keduanya menandai lokasi yang sama.
- Tiap temuan: +100 poin. Selesaikan level sebelum waktu habis (180 / 165 / 150 detik).
- Klik salah: penalti 3 detik. Petunjuk: 2 per level (tombol atau `H`).
- Keyboard: `H` petunjuk, `Esc` jeda, `M` suara, tombol panah menggerakkan bidik,
  `Spasi`/`Enter` mengklik di bidik, `Enter` lanjut saat ringkasan terbuka.
- Mode Santai: tanpa batas waktu dan tanpa penalti (dipilih di layar awal).
- Timer berhenti saat jeda dan saat tab ditinggalkan.

## Jalankan

```sh
node serve.ts   # lalu buka http://localhost:8080
```

Semua gambar digambar prosedural di Canvas dan semua bunyi dibuat dengan
WebAudio — tanpa aset eksternal dan tanpa network sama sekali.

## Entri make.fun

- Kompetisi: `best-spot-the-difference-game-20261121-0451`
- `main.ts` menyalin `game/` + `screenshots/` dan menulis `dossier.json`
  memakai `buildDossier` dari `vendor/makefun-game.ts` (salinan kit).
- Lisensi: MIT (`LICENSE`).
