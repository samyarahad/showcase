import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// -----------------------------------------------------------------------------
// GitHub Pages base path
// -----------------------------------------------------------------------------
// When you deploy this site to GitHub Pages, the URL will be:
//   https://<your-username>.github.io/<repo-name>/
//
// Vite needs to know this subpath so that all the JS/CSS/image assets in the
// built `dist/` folder are requested from the right URL.
//
// HOW TO SET THIS CORRECTLY:
//   1. Replace "pixel-ping-showcase" below with the EXACT name of your GitHub
//      repository (case-sensitive).
//   2. If you are deploying to a user/organization site
//      (https://<username>.github.io/), the repo name is
//      "<username>.github.io" and the base path MUST be "/" (root), not a
//      subpath.
//
// You can also override this at build time without editing this file:
//   VITE_BASE_PATH=/my-repo/ npm run build
// -----------------------------------------------------------------------------

const repoName = 'showcase';

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || `/${repoName}/`,
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          lenis: ['lenis'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
