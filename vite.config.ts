
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Budget Wizard',
        short_name: 'BudgetWiz',
        description: 'Une application de gestion de budget et de finances personnelles',
        theme_color: '#f59e0b',
        background_color: '#ffffff',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/maskable_icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Augmentation de la taille maximale des fichiers à mettre en cache à 6 Mo
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 Mo
        // Amélioration de la gestion du cache
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 an
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimisation pour les dépendances problématiques
  optimizeDeps: {
    include: ['@radix-ui/react-checkbox', 'lucide-react'],
    // Exclure date-fns de l'optimisation pour éviter les conflits
    exclude: ['date-fns']
  },
  // Amélioration de la gestion du cache
  cacheDir: '.vite',
  build: {
    // Assurons-nous que le build est optimisé
    sourcemap: true,
    // Augmenter la limite d'avertissement pour les gros chunks
    chunkSizeWarningLimit: 1000, // 1000 KB (1 Mo)
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react', 
            'react-dom', 
            'react-router-dom'
          ],
          'ui': [
            '@radix-ui/react-checkbox', 
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ],
          'charts': ['recharts'],
          'motion': ['framer-motion'],
          'forms': ['react-hook-form', 'zod'],
          'date': ['date-fns'],
          'queries': ['@tanstack/react-query'],
          'icons': ['lucide-react']
        }
      }
    }
  }
}));
