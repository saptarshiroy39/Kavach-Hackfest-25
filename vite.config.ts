import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Vite Configuration
 * https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Add automatic open to browser in dev mode
    open: mode === "development",
    // Add CORS for API development
    cors: true
  },
  plugins: [
    react(),
    // Only use component tagger in development
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimizations for production builds
  build: {
    // Reduce chunk size
    chunkSizeWarningLimit: 1000,
    // Split CSS chunks
    cssCodeSplit: true,
    // Generate sourcemaps in dev mode only
    sourcemap: mode === "development",
    // Optimize build process
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and libraries into separate chunks
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Split context providers
          providers: [
            '@/context',
          ],
        },
      },
    },
  },
  // Environment variable configuration
  envPrefix: 'KAVACH_',
}));
