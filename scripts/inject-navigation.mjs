#!/usr/bin/env node
/**
 * Phase 17.7 — ensure navigation.js is loaded on every static HTML page (once per file).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SNIPPET = '  <script src="/assets/js/navigation.js" defer></script>\n';

function walkHtml(dir, out) {
  var list = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < list.length; i++) {
    var ent = list[i];
    var full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git') continue;
      walkHtml(full, out);
    } else if (ent.name.endsWith('.html')) {
      out.push(full);
    }
  }
}

function main() {
  var files = [];
  walkHtml(ROOT, files);
  var n = 0;
  files.forEach(function (file) {
    var s = fs.readFileSync(file, 'utf8');
    if (s.includes('navigation.js')) return;
    if (!s.includes('</body>')) return;
    var next = s.replace(/<\/body>/i, SNIPPET + '</body>');
    if (next !== s) {
      fs.writeFileSync(file, next, 'utf8');
      n++;
    }
  });
  console.log('inject-navigation: added script to', n, 'of', files.length, 'html files');
}

main();
