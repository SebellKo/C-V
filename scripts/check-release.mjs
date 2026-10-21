import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';
import { Script } from 'node:vm';

const root = process.cwd();
const dist = resolve(root, 'dist');
const json = async (path) => JSON.parse(await readFile(path, 'utf8'));
const manifest = await json(resolve(dist, 'manifest.json'));
const pkg = await json(resolve(root, 'package.json'));
assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.version, pkg.version);
assert.deepEqual(manifest.permissions.toSorted(), ['clipboardWrite', 'storage']);
assert.equal(manifest.host_permissions, undefined);
assert.equal(manifest.background.type, 'module');
assert.deepEqual(manifest.content_scripts[0].matches, ['http://*/*', 'https://*/*']);

async function asset(path) {
  assert.equal(typeof path, 'string');
  const full = resolve(dist, path);
  const local = relative(dist, full);
  assert(local && !local.startsWith('..') && !isAbsolute(local), `Invalid asset: ${path}`);
  assert((await stat(full)).isFile(), `Missing asset: ${path}`);
  return full;
}

await asset(manifest.background.service_worker);
const popup = await asset(manifest.action.default_popup);
const html = await readFile(popup, 'utf8');
for (const [, path] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  await asset(path.replace(/^\//, ''));
}
for (const script of manifest.content_scripts) {
  for (const path of script.js) {
    // Content scripts must remain classic scripts, not module entry points.
    new Script(await readFile(await asset(path), 'utf8'), { filename: path });
  }
}

async function png(path, width, height, opaque = false) {
  const buffer = await readFile(path);
  assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', path);
  assert.equal(buffer.toString('ascii', 12, 16), 'IHDR', path);
  assert.equal(buffer.readUInt32BE(16), width, path);
  assert.equal(buffer.readUInt32BE(20), height, path);
  if (opaque) assert.equal(buffer[25], 2, `Expected RGB PNG: ${path}`);
}
for (const size of [16, 32, 48, 128]) {
  const path = manifest.icons[size];
  assert.equal(manifest.action.default_icon[size], path);
  await png(await asset(path), size, size);
}
const store = resolve(root, 'design/branding/store');
await png(resolve(store, 'icon-128.png'), 128, 128);
await png(resolve(store, 'promo-en-440x280.png'), 440, 280, true);
const screenshots = (await readdir(resolve(store, 'screenshots'))).filter((name) => name.endsWith('.png'));
assert.equal(screenshots.length, 5);
for (const name of screenshots) await png(resolve(store, 'screenshots', name), 640, 400, true);

const files = await readdir(dist, { recursive: true, withFileTypes: true });
for (const file of files.filter((entry) => entry.isFile())) {
  const path = relative(dist, resolve(file.parentPath, file.name));
  assert(!/(^|\/)(node_modules|tests|docs|design|qa-results)(\/|$)|\.map$|\.DS_Store|\.test\./.test(path), `Unwanted release file: ${path}`);
  assert(/\.(html|js|css|json|png)$/.test(path), `Unexpected release file: ${path}`);
}
console.log(`Release checks passed: v${manifest.version}, ${files.filter((entry) => entry.isFile()).length} build files, 5 store screenshots.`);
