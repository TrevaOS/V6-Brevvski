import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/V6-Brevvski/",
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 3000,
  },
});
