/// <reference types="vitest" />

import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setupTests.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@froxy/react-markdown',
      formats: ['es'], // 포맷 추가
      fileName: (format) => `index.${format}.js` // 포맷별 파일명
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        exports: 'named', // named exports 설정
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: '[name].js',
        manualChunks: undefined,
        inlineDynamicImports: false
      }
    }
  },

  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      include: ['src'],
      rollupTypes: true // 타입 번들링
    })
  ]
});
