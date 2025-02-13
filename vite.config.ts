import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import electron from 'vite-plugin-electron'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      entry: 'electron/main.cjs',
    })],

})
