module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  globals: {
    uni: 'readonly',
    wx: 'readonly',
    getCurrentPages: 'readonly',
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-console': 'off',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
    '@typescript-eslint/consistent-type-assertions': 'off',
    'vue/multi-word-component-names': 'off',
  },
};
