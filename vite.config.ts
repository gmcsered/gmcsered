import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // GitHub Pages supplies its actual base path in CI. A custom domain can keep
  // using the root path by setting VITE_BASE_PATH=/ in its deployment settings.
  const productionBase = loadEnv(mode, ".", "").VITE_BASE_PATH || "/";

  return {
    base: mode === "production" ? productionBase : "/",
    plugins: [react()],
  };
});
