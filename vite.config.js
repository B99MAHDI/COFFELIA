import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" : les fichiers sont chargés avec des chemins relatifs, donc le site
// fonctionne sur GitHub Pages quel que soit le nom du dépôt.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
