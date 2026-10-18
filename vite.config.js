import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'TreeToy',
      fileName: (format) => (format === 'es' ? 'treetoy.js' : 'treetoy.umd.cjs'),
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        exports: 'named',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'treetoy.css';
          return assetInfo.name;
        }
      }
    }
  }
});
