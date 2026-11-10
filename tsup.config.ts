import { defineConfig } from 'tsup';

export default defineConfig([
    {
        entry: { index: 'src/index.ts', react: 'src/react.ts', vue: 'src/vue.ts' },
        format: ['esm', 'cjs'],
        external: ['react', 'vue'],
        splitting: true,
        dts: true,
        target: 'es2020',
        clean: true,
    },
    {
        entry: { index: 'src/index.ts' },
        format: ['iife'],
        globalName: 'StickySidebar',
        minify: true,
        target: 'es2020',
        define: { 'process.env.NODE_ENV': '"production"' },
    },
]);
