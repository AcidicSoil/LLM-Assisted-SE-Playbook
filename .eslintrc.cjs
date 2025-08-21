/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  extends: ['eslint:recommended', 'prettier'],
  ignorePatterns: [
    'dist',
    'build',
    'coverage',
    'public',
    'node_modules',
    'playwright-report',
    'llm-playbook/**',
  ],
  overrides: [
    // TypeScript + React files
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'react-hooks'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
      ],
      rules: {
        // Adjustments for this project
      },
    },
    // CommonJS config files
    {
      files: ['**/*.cjs'],
      env: { node: true },
      parserOptions: { sourceType: 'script' },
    },
  ],
};
