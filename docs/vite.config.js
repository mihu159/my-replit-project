import { defineConfig } from 'vite';

export default defineConfig({
  base: '/my-replit-project/', // 👈 this must match your GitHub repo name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/my-replit-project/', // 👈 This must match your GitHub repo name
});
