import { mkdir, rm } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('build/contents', { recursive: true });
await Promise.all([
  rm('build/service-worker.js', { force: true }),
  rm('build/service-worker.js.map', { force: true }),
  rm('build/contents/content.js', { force: true }),
  rm('build/contents/content.js.map', { force: true }),
]);

const commonOptions = {
  bundle: true,
  platform: 'browser',
  target: 'chrome114',
  minify: true,
  logLevel: 'info',
};

await Promise.all([
  build({
    ...commonOptions,
    entryPoints: ['extension/service-worker.ts'],
    outfile: 'build/service-worker.js',
    format: 'esm',
  }),
  build({
    ...commonOptions,
    entryPoints: ['extension/contents/content.ts'],
    outfile: 'build/contents/content.js',
    format: 'iife',
  }),
]);
