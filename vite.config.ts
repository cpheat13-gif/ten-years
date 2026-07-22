import { defineConfig } from "vite";

// When building for GitHub Pages the site is served from
// https://<user>.github.io/ten-years/ so assets must be prefixed with the
// repo name. In local dev we serve from the root instead.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/ten-years/" : "/",
}));
