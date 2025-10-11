import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      outDir: 'dist',
      rollupTypes: true
    })
  ],
  root: './',
  publicDir: resolve(__dirname, 'test/manual'),
  server: {
    port: 3000,
    open: '/test/manual/index.html'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'printJS',
      fileName: 'print',
      formats: ['umd']
    },
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'print.css'
          return assetInfo.name
        }
      }
    }
  }
})
