/* eslint-env node */
/* eslint-disable no-undef */

const eslint = require('@eslint/js')
const tseslint = require('@typescript-eslint/eslint-plugin')
const tseslintParser = require('@typescript-eslint/parser')
const prettierConfig = require('eslint-config-prettier')
const prettier = require('eslint-plugin-prettier')

module.exports = [
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        module: true,
        process: true,
        console: true,
        fetch: true,
        require: true,
        __dirname: true,
        __filename: true,
        document: true,
        setTimeout: true,
        URL: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'no-extra-boolean-cast': 'off',

      semi: ['error', 'never'],
      '@typescript-eslint/semi': ['error', 'never'],

      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 100,
          tabWidth: 2,
          semi: false,
        },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          args: 'none',
        },
      ],
    },
  },
  prettierConfig,
]
