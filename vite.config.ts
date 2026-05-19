import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: path.resolve(dirname, 'src/HelloCard/index.tsx'),
      name: 'HelloCard',
      formats: ['es'],
      fileName: () => 'hello-card.js',
    },
    rollupOptions: {
      external: [],
    },
    outDir: 'dist',
    minify: false,
  },
  resolve: {
    dedupe: ['preact', 'preact/hooks', 'preact/compat'],
  },
});
