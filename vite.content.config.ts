import { defineConfig } from 'vite';

// Manifest의 정적 Content Script는 module이 아니므로 공용 코드를 포함한 단일 스크립트로 빌드한다.
export default defineConfig({
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry: 'src/content/index.ts',
      name: 'CVContent',
      formats: ['iife'],
      fileName: () => 'content.js',
    },
  },
});
