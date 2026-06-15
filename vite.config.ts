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
        manualChunks(id) {
          if (id.includes('node_modules/react')) return 'vendor-react';
          if (id.includes('node_modules/socket.io-client')) return 'vendor-socketio';
          if (id.includes('node_modules/i18next')) return 'vendor-i18n';
          if (id.includes('node_modules/axios')) return 'vendor-axios';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
  server: {
    open: true
  }
});
