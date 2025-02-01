import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
// import postcss from 'rollup-plugin-postcss';

// https://vitejs.dev/config/
export default defineConfig({
  cssCodeSplit: true,
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
      entry: 'src/index.js',
      name: 'agvmap-react',
      formats: ['es', 'umd'],
      fileName: (format) => `agvmap-react.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins: [
    // postcss({
    //   extract: true,
    //   minimize: true,
    // }),
    react(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
