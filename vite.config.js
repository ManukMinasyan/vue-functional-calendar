import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: fileURLToPath(new URL('./index.js', import.meta.url)),
      formats: ['es', 'cjs'],
      fileName: format =>
        `vue-functional-calendar.${format === 'es' ? 'js' : 'cjs'}`,
      cssFileName: 'style'
    },
    rollupOptions: {
      external: ['vue'],
      output: { exports: 'named' }
    }
  },
  test: {
    environment: 'jsdom'
  }
})
