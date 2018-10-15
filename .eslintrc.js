module.exports = {
  env: {
    node: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'prefer-promise-reject-errors': 0,
    'no-underscore-dangle': 0,
  },
};
