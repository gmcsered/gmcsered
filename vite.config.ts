import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The production site is served from the custom domain root.
const productionBase = "/";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? productionBase : "/",
  plugins: [react()],
}));
