import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    port: 3000,
  },
  build: {
    lib: {
      entry: './src/App.jsx',
      name: 'AgvMapReact',
      fileName: (format) => `agvmapReact.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // Externalize React and ReactDOM
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
