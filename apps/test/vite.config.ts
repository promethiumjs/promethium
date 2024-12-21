import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  optimizeDeps: {
    exclude: ["promethium-js"],
  },
  server: {
    open: true,
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
  },
});
