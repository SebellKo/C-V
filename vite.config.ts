import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html',
        background: 'src/background/index.ts',
        content: 'src/content/index.ts',
      },
      output: {
        entryFileNames: ({ name }) =>
          name === 'background' || name === 'content'
            ? '[name].js'
            : 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
