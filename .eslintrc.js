module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'prettier', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'airbnb/base',
    'airbnb/whitespace',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
    'prettier/@typescript-eslint',
  ],

  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    camelcase: ['error', { allow: ['__webpack_public_path__'] }],
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'import/extensions': [
      'error',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        json: 'always',
        less: 'always',
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        // memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false,
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: ['builtin', 'internal', 'external', 'sibling', 'parent', 'index'],
        alphabetize: {
          order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },
      },
    ],
    'no-use-before-define': 0,
    // '@typescript-eslint/camelcase': [
    //   'error',
    //   {
    //     properties: 'always',
    //   },
    // ],

    // let prettier handle indent
    // '@typescript-eslint/indent': 0,
    'import/prefer-default-export': 0,
    'no-param-reassign': 0,

    '@typescript-eslint/triple-slash-reference': [2, { path: 'always' }],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
    '@typescript-eslint/consistent-type-imports': 'error',

    'import/no-cycle': 0,
    /** let ts resolve import */
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/__tests__/**', '**/__mocks__/**', 'test.{js,jsx}'],
        optionalDependencies: false,
        packageDir: ['./', __dirname],
      },
    ],

    // _开头的变量为忽略变量
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': ['error', { overrides: { constructors: 'no-public' } }],

    'linebreak-style': 0,
    'no-console': 0,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.js', '.jsx', '.json', '.tsx', '.d.ts'],
    },
  },
}
