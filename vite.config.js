import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'tailwindcss-browser-based-builder',
      fileName: (format) => `tailwindcss-browser-based-builder.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        globals: {
          // Add external dependencies here if needed
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
});