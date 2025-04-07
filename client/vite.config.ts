import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    proxy: {
      "/api":"https://codechat-zsjt.onrender.com",
      "/cdn": {
        target: "https://unpkg.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
