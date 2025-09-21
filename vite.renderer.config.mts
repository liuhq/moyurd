import tailwindcssPlugin from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

// https://vitejs.dev/config
export default defineConfig({
    plugins: [
        tailwindcssPlugin(),
        solidPlugin(),
    ],
    build: {
        target: 'esnext',
    },
})
