import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({ target: "node-server" }),
    react({ jsxRuntime: "automatic" }),
  ],
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode === "production" ? "production" : "development"),
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 3000),
    strictPort: false,
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 3000),
  },
}));
