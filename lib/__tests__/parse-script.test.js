'use strict'

const parseScript = require('../parse-script')

describe('parse-script', () => {
  it.each([
    [
      'jest',
      { jest: 'path/to/jest' },
      {
        name: 'jest',
        path: 'path/to/jest',
        args: [],
        options: {},
      },
    ],
    [
      'eslint --fix .',
      { eslint: 'path/to/eslint' },
      {
        name: 'eslint',
        path: 'path/to/eslint',
        args: ['--fix', '.'],
        options: {},
      },
    ],
    [
      ['webpack'],
      { webpack: 'path/to/webpack' },
      {
        name: 'webpack',
        path: 'path/to/webpack',
        args: [],
        options: {},
      },
    ],
    [
      ['webpack', { env: { NODE_ENV: 'production' } }],
      { webpack: 'path/to/webpack' },
      {
        name: 'webpack',
        path: 'path/to/webpack',
        args: [],
        options: { env: { NODE_ENV: 'production' } },
      },
    ],
    [
      ['webpack-dev-server --open', { env: { NODE_ENV: 'development' } }],
      { 'webpack-dev-server': 'path/to/webpack-dev-server' },
      {
        name: 'webpack-dev-server',
        path: 'path/to/webpack-dev-server',
        args: ['--open'],
        options: { env: { NODE_ENV: 'development' } },
      },
    ],
    [
      ['nodemon   --help'],
      { nodemon: 'path/to/nodemon' },
      {
        name: 'nodemon',
        path: 'path/to/nodemon',
        args: ['--help'],
        options: {},
      },
    ],
    [
      'lerna --message "This is a message"',
      { lerna: 'path/to/lerna' },
      {
        name: 'lerna',
        path: 'path/to/lerna',
        args: ['--message', 'This is a message'],
        options: {},
      },
    ],
    [
      "lerna --message 'This is a message'",
      { lerna: 'path/to/lerna' },
      {
        name: 'lerna',
        path: 'path/to/lerna',
        args: ['--message', 'This is a message'],
        options: {},
      },
    ],
    [
      'lerna --message \'This is a "message"\'',
      { lerna: 'path/to/lerna' },
      {
        name: 'lerna',
        path: 'path/to/lerna',
        args: ['--message', 'This is a "message"'],
        options: {},
      },
    ],
  ])('parses %j', (script, scripts, expected) => {
    const result = parseScript(script, scripts)
    expect(result).toEqual(expected)
  })
})
