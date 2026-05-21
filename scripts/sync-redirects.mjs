/**
 * Phase 18.1 — Write _redirects to public/ (source) and repo root (Netlify publish dir).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { REDIRECTS_CONTENT } from './site-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

export function syncRedirects() {
  const publicDir = path.join(ROOT, 'public');
  fs.mkdirSync(publicDir, { recursive: true });
  const targets = [
    path.join(publicDir, '_redirects'),
    path.join(ROOT, '_redirects')
  ];
  targets.forEach(function (file) {
    fs.writeFileSync(file, REDIRECTS_CONTENT, 'utf8');
  });
  return targets;
}

const isCli =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);
if (isCli) {
  syncRedirects().forEach(function (f) {
    console.log('Wrote', path.relative(ROOT, f));
  });
}
