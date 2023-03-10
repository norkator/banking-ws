module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: 'tsconfig.base.json'
  },
  extends: [
    'plugin:@typescript-eslint/recommended' // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  rules: {
    // "quotes": [2, "single", {"avoidEscape": true}], // not working
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    'quotes': [2, 'single', {'avoidEscape': true}],
  },
  overrides: [
    {
      'files': ['*.ts'],
      'plugins': ['deprecation'],
      'rules': {
        'deprecation/deprecation': 'warn',
      },
    },
  ],

};
