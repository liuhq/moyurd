import { resolve } from 'node:path'
import { defineConfig } from 'vite'

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
})
