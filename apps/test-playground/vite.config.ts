import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    exclude: ["promethium-js"],
  },
  server: {
    open: true,
  },
});
