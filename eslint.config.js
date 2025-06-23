const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-plugin-prettier');
const jest = require('eslint-plugin-jest');
const noHtmlEscapes = require('./eslint-rules/no-html-escapes.js'); // 👈 custom rule

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      prettier,
      'custom-rules': {
        rules: {
          'no-html-escapes': noHtmlEscapes,
        },
      },
    },
    rules: {
      'prettier/prettier': 'error',
      semi: ['warn', 'always'],
      'custom-rules/no-html-escapes': 'warn', // 👈 enable the custom rule
    },
  },
  {
    // ✅ Jest config for test files
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    plugins: {
      jest,
    },
    languageOptions: {
      globals: {
        jest: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
      },
    },
    rules: {
      ...jest.configs.recommended.rules,
    },
  },
  {
    // ✅ Jest config for setup files like jest.setup.js
    files: ['jest.setup.js'],
    languageOptions: {
      globals: {
        jest: true,
      },
    },
  },
]);
