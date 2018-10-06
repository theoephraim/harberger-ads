// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: ['async-await'],
  // add your custom rules here
  rules: {
    // don't require .js extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': process.env.NODE_ENV === 'production'
      ? ['warn', { "args": "none" }]
      : 'off'
    ,
    'no-plusplus': 0, // i++ OK :D
    'arrow-parens': ["error", "always"], // Forces `(thing) -> thing.x`
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'ctx', // for koa
        'refs', // for our Models populateRef stuff
      ],
    }],
    // sometimes it makes sense if you think the file will soon be expanded
    'import/prefer-default-export': 0,
    'radix': 0,
    'no-restricted-syntax': 0
  }
}
