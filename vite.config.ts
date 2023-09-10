import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      root: "example",
      server: {
        port: 3000,
      },
    };
  }
  return {
    build: {
      outDir: "dist",
      rollupOptions: {
        input: "src/index.ts",
        output: {
          format: "esm",
          dir: "dist",
        },
      },
      lib: {
        name: "setupTheme",
        entry: "src/index.ts",
        formats: ["iife", "es"],
      },
    },
  };
});
