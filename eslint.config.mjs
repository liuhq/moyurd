import js from '@eslint/js'
import solid from 'eslint-plugin-solid'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    globalIgnores([
        '.vite',
        'example',
        'node_modules',
        'dist',
        'out',
    ]),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            solid.configs['flat/typescript'],
        ],
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', {
                'vars': 'all',
                'varsIgnorePattern': '^_',
                'args': 'all',
                'argsIgnorePattern': '^_',
                'caughtErrors': 'all',
                'caughtErrorsIgnorePattern': '^_',
                'destructuredArrayIgnorePattern': '^_',
            }],
        },
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    },
)
