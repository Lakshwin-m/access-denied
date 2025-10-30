import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add this for Vercel deployment
  build: {
    outDir: "dist",
  },
  // Add this for client-side routing
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
  },
}));
