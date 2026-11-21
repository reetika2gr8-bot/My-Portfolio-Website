import { defineConfig } from 'vite';

// base './' keeps every path relative, so the built site works on
// GitHub Pages sub-paths, Netlify, or any static host.
export default defineConfig({
  base: './',
  build: { assetsDir: 'bundle', target: 'es2020' },
  server: { host: true, port: 5173 },
});
