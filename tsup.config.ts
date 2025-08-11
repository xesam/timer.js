import { defineConfig } from 'tsup'

export default defineConfig([
  // 构建ESM - 保持文件结构
  {
    entry: ['src/**/*.ts'],
    format: ['esm'],
    outDir: 'dist/esm',
    splitting: false,
    sourcemap: true,
    clean: false,
    bundle: false,
    outExtension() {
      return { js: '.js' }
    },
    esbuildOptions(options) {
      options.outbase = 'src'
      options.platform = 'neutral'
    }
  },
  // 构建类型定义 - 输出到 dist/types 目录
  {
    entry: ['src/**/*.ts'],
    format: ['cjs'],
    dts: {
      only: true
    },
    outDir: 'dist/types',
    splitting: false,
    sourcemap: false,
    clean: false,
    bundle: false,
    outExtension() {
      return { js: '.d.ts' }
    },
    esbuildOptions(options) {
      options.outbase = 'src'
    }
  },
  // 构建微信小程序兼容的CJS - 打包模式
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    outDir: 'dist',
    splitting: false,
    sourcemap: true,
    clean: false,
    bundle: true,
    shims: true,
    outExtension() {
      return { js: '.js' }
    },
    esbuildOptions(options) {
      options.outbase = 'src'
      options.platform = 'neutral'
    }
  }
])