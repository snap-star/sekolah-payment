import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import checker from 'vite-plugin-checker'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    checker({
      typescript: true,
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB to avoid warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor dependencies into separate chunks
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@tanstack') || id.includes('node_modules/next-themes') || id.includes('node_modules/sonner') || id.includes('node_modules/lucide-react')) {
            return 'ui-vendor';
          }
        }
      }
    }
  },
  resolve:{
    tsconfigPaths: true,
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@types': path.resolve(__dirname, './src/types'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@server': path.resolve(__dirname, './src/server'),
      '@client': path.resolve(__dirname, './src/client'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@mock': path.resolve(__dirname, './src/mock')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://yogatama.web.id',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
    },
  },
});