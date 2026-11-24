import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
const root = new URL('../dist/', import.meta.url);
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? files(join(dir, e.name)) : join(dir, e.name)))).flat();
}
const all = await files(fileURLToPath(root));
for (const ext of ['.js', '.css', '.woff2']) {
  const matching = all.filter(f => f.endsWith(ext));
  const bytes = await Promise.all(matching.map(async f => { const b = await readFile(f); return ext === '.woff2' ? b.length : gzipSync(b).length; }));
  console.log(`${ext}: ${matching.length} files, ${(bytes.reduce((a,b)=>a+b,0)/1024).toFixed(1)} KiB total emitted; largest ${(Math.max(0,...bytes)/1024).toFixed(1)} KiB`);
}
console.log('Inventory only: emitted files include assets not loaded on every page. Measure per-page initial transfer in browser DevTools.');
