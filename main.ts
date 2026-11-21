// main.ts — program penyerahan entri "Biro Barang Tersesat" (Node 22, stdlib saja).
//
// Game-nya adalah file statis di game/ (index.html + modul ES + CSS, tanpa
// library dan tanpa network). Program ini menyalin game/ dan screenshots/ dari
// sebelah file ini ke direktori keluaran, lalu menulis dossier.json dengan
// buildDossier dari vendor/makefun-game.ts (salinan kit, tidak diubah).
//
// Di luar container grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Program ini deterministik: dua kali jalan menghasilkan byte yang identik.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outputDir, 'game'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// Batas gate (lihat RULES.txt kit): dossier teks maks 160 KiB, maks 4 screenshot
// @ 256 KiB, game/ maks 993 entri dan 48 MiB, tiap path maks 1000 byte.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
