module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-essential',
    'plugin:prettier/recommended',
    'prettier/vue',
  ],

  plugins: ['prettier'],

  parserOptions: {
    parser: 'babel-eslint',
  },

  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-warning-comments': 'warn',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'prettier/prettier': 'error',
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
        '**/tests/unit/**/*.mock.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
}
