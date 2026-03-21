import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use "/" when a custom domain is configured (VITE_CUSTOM_DOMAIN env var set during CI build),
  // otherwise fall back to the GitHub Pages repo sub-path for the default *.github.io URL.
  base: process.env.VITE_CUSTOM_DOMAIN ? "/" : (mode === "production" ? "/crystal-clear-sol/" : "/"),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
