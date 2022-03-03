module.exports = {
  root: true,
  extends: [
    'airbnb',
    'airbnb-typescript'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react/no-array-index-key': 'off',
        'react/style-prop-object': 'off',
        "import/prefer-default-export": "off",
        "@typescript-eslint/no-use-before-define": "off",
      },
    },
  ],
};
