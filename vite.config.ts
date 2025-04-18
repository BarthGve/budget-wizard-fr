
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
        // Augmentation de la taille maximale des fichiers à mettre en cache à 4 Mo
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 Mo
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
    rollupOptions: {
      output: {
        manualChunks: {
          'radix-ui': ['@radix-ui/react-checkbox'],
          'lucide': ['lucide-react']
        }
      }
    }
  }
}));
