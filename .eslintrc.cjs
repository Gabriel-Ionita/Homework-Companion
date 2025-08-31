/* eslint config for monorepo: frontend (react) + backend (node) */
module.exports = {
  root: true,
  env: { es2021: true, node: true, browser: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  settings: { react: { version: 'detect' } },
  ignorePatterns: ['dist', 'build', 'coverage', 'node_modules'],
  overrides: [
    {
      files: ['frontend/**/*.{ts,tsx}'],
      env: { browser: true, node: false },
      rules: {
        'react/react-in-jsx-scope': 'off'
      }
    },
    {
      files: ['backend/**/*.ts'],
      env: { node: true, browser: false }
    }
  ]
}
