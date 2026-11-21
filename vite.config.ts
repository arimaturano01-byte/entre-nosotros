import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: '/entre-nosotros/',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Entre Nosotros',
          short_name: 'Nosotros',
          description: 'Un lugar para todo lo que somos.',
          theme_color: '#f8e8ed',
          background_color: '#fff9fb',
          display: 'standalone',
          start_url: '/entre-nosotros/',
          scope: '/entre-nosotros/',
          icons: [
            {
              src: '/entre-nosotros/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/entre-nosotros/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
