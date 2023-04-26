import { defineConfig } from "vite";

export default defineConfig({
  root: "test",
  build: {
    target: "esnext",
    sourcemap: true,
  },
})