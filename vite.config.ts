import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [
        reactCompilerPreset()
      ],
      include: /\.[jt]sx$/,
      exclude: /node_modules/,
    }),
    tailwindcss()
  ],
  resolve: {
    tsconfigPaths: true
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash][extname]', // CSS, imágenes, etc.
      },
    },
  },
  server: {
    open: true
  }
});
