import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Keep the deploy path in one place. A future custom-domain build only needs `/` here.
const githubPagesBase = "/gmcsered/";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? githubPagesBase : "/",
  plugins: [react()],
}));
