import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry: fileURLToPath(new URL('./index.umd.js', import.meta.url)),
      name: 'FunctionalCalendar',
      formats: ['umd'],
      fileName: () => 'vue-functional-calendar.umd.js',
      cssFileName: 'style'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'default',
        globals: { vue: 'Vue' }
      }
    }
  }
})
