import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2022',
    // チャンク分割は rolldown の既定に任せる。
    // （Vite 8 の manualChunks は関数のみ受け付ける点に注意）
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
})
