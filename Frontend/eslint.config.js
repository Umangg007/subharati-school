import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Keep lint useful but avoid blocking on inherited dead-code noise.
      'no-unused-vars': 'warn',
      // Existing codebase patterns intentionally set state in some effects.
      'react-hooks/set-state-in-effect': 'off',
      // Disable compiler-specific memoization preservation errors for now.
      'react-hooks/preserve-manual-memoization': 'off',
    },
  },
])
