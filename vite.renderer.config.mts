import tailwindcssPlugin from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

// https://vitejs.dev/config
export default defineConfig({
    resolve: {
        alias: {
            '#lib': resolve(__dirname, './lib'),
            '#main': resolve(__dirname, './main'),
            '#renderer': resolve(__dirname, './renderer'),
            '#config': resolve(__dirname, './config'),
        },
    },
    plugins: [
        tailwindcssPlugin(),
        solidPlugin(),
    ],
    build: {
        target: 'esnext',
    },
})
