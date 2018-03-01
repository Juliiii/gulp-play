// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // add your custom rules here
  rules: {
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'prefer-promise-reject-errors': 'off',
    'no-useless-return': 'off',
    'promise/param-names': 'off'
  }
}
