import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['./resources/css/app.css', './resources/js/app.tsx', './resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        react({
            include: /\.(jsx|tsx|js)$/,
            runtimeDom: true,
            jsx: 'react-jsx',
            jsxRuntime: 'automatic',
            tsx: true,
            typescript: true,
            tsconfig: './tsconfig.json',
            fastRefresh: false,
            bundleDev: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
