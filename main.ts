// Harbour Lights: the submission program. It copies game/ and screenshots/
// from this repository into the output directory and writes dossier.json
// there with buildDossier from vendor/makefun-game.ts. It uses only the
// Node standard library, writes the same bytes on every run, and reads
// nothing outside this repository.
import { copyFileSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

function copyTree(sourceDir: string, targetDir: string): void {
  mkdirSync(targetDir, { recursive: true });
  const entries = readdirSync(sourceDir).sort();
  for (const entry of entries) {
    const source = join(sourceDir, entry);
    const target = join(targetDir, entry);
    const info = statSync(source);
    if (info.isDirectory()) {
      copyTree(source, target);
    } else if (info.isFile()) {
      copyFileSync(source, target);
    }
  }
}

copyTree(join(repoRoot, 'game'), join(outDir, 'game'));
copyTree(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'));
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
