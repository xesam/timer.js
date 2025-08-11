import { defineConfig } from 'tsup'

export default defineConfig([
  // 构建CJS
  {
    entry: ['src/**/*.ts'],
    format: ['cjs'],
    outDir: 'dist/cjs',
    splitting: false,
    sourcemap: true,
    clean: true,
    bundle: false,
    outExtension() {
      return { js: '.js' }
    },
    esbuildOptions(options) {
      options.outbase = 'src'
      options.platform = 'node'
    }
  },
  // 构建ESM
  {
    entry: ['src/**/*.ts'],
    format: ['esm'],
    outDir: 'dist/esm',
    splitting: false,
    sourcemap: true,
    clean: false, // 不清理，让CJS构建清理
    bundle: false,
    outExtension() {
      return { js: '.js' }
    },
    esbuildOptions(options) {
      options.outbase = 'src'
      options.platform = 'neutral'
    }
  },
  // 构建类型定义
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
  }
])