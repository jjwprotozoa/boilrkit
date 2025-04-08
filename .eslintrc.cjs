module.exports = {
  root: true,
  env: {
    node: true,
    browser: true, // <-- ADD THIS
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: ['eslint:recommended'],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
  },
  overrides: [
    {
      files: ['src/templates/**/*.js', 'dist/templates/**/*.js'],
      env: {
        browser: true,
      },
    },
  ],
};
