import { defineConfig } from 'tsdown';
import { writeFileSync, mkdirSync } from 'node:fs';

export default defineConfig([
    {
        entry: { index: 'src/index.ts' },
        format: ['cjs'],
        target: 'es2015',
        outDir: 'dist/cjs',
        outExtensions: () => ({ js: '.js' }),
        dts: false,
        sourcemap: true,
        clean: false,
        onSuccess: async () => {
            writeFileSync('dist/cjs/package.json', JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');
        }
    },
    {
        entry: { index: 'src/index.ts' },
        format: ['esm'],
        target: 'es2015',
        outDir: 'dist/esm',
        outExtensions: () => ({ js: '.js' }),
        dts: false,
        sourcemap: true,
        clean: false,
        onSuccess: async () => {
            writeFileSync('dist/esm/package.json', JSON.stringify({ type: 'module' }, null, 2) + '\n');
        }
    },
    {
        entry: { index: 'src/index.ts' },
        format: ['esm'],
        target: 'es2015',
        outDir: 'dist/types',
        outExtensions: () => ({ dts: '.d.ts' }),
        dts: { emitDtsOnly: true, sourcemap: false },
        sourcemap: false,
        clean: false,
        onSuccess: async () => {
            mkdirSync('dist/types', { recursive: true });
            writeFileSync('dist/types/package.json', JSON.stringify({ type: 'module' }, null, 2) + '\n');
        }
    }
]);
