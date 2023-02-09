module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'sort-keys-fix',
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    'sort-keys-fix/sort-keys-fix': 'warn',
    'object-curly-newline': 'off',
  },
  settings: {
    "import/resolver": "webpack"
  },
};
