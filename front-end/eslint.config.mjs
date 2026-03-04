import expoConfig from 'eslint-config-expo/flat.js';

export default [
  ...expoConfig,
  {
    ignores: ['dist/**'],
    rules: {
      'no-console': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
];
