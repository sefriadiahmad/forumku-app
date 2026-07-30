/* eslint-disable linebreak-style */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react-refresh'],
  rules: {
    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // React Refresh rules
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // Prettier compatibility
    'prettier/prettier': 'off',

    // Airbnb overrides for Redux Toolkit and modern patterns
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-shadow': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': 'off',

    // Redux Toolkit patterns (mutable state is fine in reducers)
    'no-param-reassign': 'off',

    // Allow common patterns
    'no-nested-ternary': 'off',
    'arrow-body-style': 'off',
    'prefer-template': 'off',
    'no-plusplus': 'off',
    'consistent-return': 'off',
    'dot-notation': 'off',
    'default-param-last': 'off',
    'no-use-before-define': 'off',
    'max-classes-per-file': 'off',
    'no-new': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
      env: {
        jest: true,
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
