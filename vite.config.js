import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite is the tool that turns our React code into the plain
// HTML/CSS/JS files that Hostinger (or any static host) can serve.
export default defineConfig({
  plugins: [react()],
});
