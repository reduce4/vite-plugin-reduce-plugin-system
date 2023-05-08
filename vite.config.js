import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'
import reducePluginSystem from './src/main.js'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), Inspect(), reducePluginSystem()],
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'vite-plugin-reduce-plugin-system',
      fileName: format => `vite-plugin-reduce-plugin-system.${format}.js`
    },
    rollupOptions: {
      // 外部化依赖项，以便可以从 CDN 获得更好的性能
      external: ['react', 'antd'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: 'React'
        }
      }
    }
  }
})
