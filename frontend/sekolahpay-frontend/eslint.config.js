/**
 * ESLint Configuration File
 * Maintained for TypeScript + React project with Vite + Tailwind CSS v4
 * @see https://eslint.org/docs/latest/use/configure/
 */

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // Global ignore patterns - applies to all configurations
  globalIgnores([
    'dist',
    'backend/**/*',
    'sekolahpay_server/**/*',
    'node_modules',
    'build',
    '*.config.*',
    '*.config.js',
    'vite.config.ts',
    '**/*.css' // CSS files are handled by Tailwind, no need for ESLint CSS linting
  ]),

  // Main configuration for TypeScript + React files
  {
    // Target all TypeScript and React files only
    files: ['**/*.{ts,tsx}'],

    // Extend recommended configurations from core plugins
    extends: [
      // JavaScript: ESLint's recommended rules
      js.configs.recommended,
      // TypeScript: TypeScript's recommended rules
      ...tseslint.configs.recommended,
      reactRefresh.configs.recommended,
    ],

    // Register custom plugins
    plugins: {
      'react-hooks': reactHooks,
      'typescript-eslint': tseslint,
    },

    // Language configuration
    languageOptions: {
      // Define browser globals (window, document, etc.)
      globals: {
        ...globals.browser
      }
    },
    

    // Custom rule overrides
    rules: {
      // React Refresh rule to ensure Fast Refresh works correctly
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
    }
  }
]);