import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import dotenv from "dotenv";
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  // define: {
  //   "process.env": process.env,
  // },
  define: {
    // Only expose specific environment variables, not the entire process.env
    'process.env.VITE_CONTRACT_ADDRESS': JSON.stringify(process.env.VITE_CONTRACT_ADDRESS),
    // Add any other specific environment variables you need
    // 'process.env.VARIABLE_NAME': JSON.stringify(process.env.VARIABLE_NAME),
  },
});
