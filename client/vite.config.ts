import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    proxy: {
      "/question": {
        //target: "http://localhost:8080",

        target: "http://192.168.15.81:8080",
        changeOrigin: true,
      },
    },
  },
})