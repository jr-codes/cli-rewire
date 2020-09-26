'use strict'

const mergeArgs = require('./merge-args')

describe('merge-args', () => {
  it.each([
    // Should merge default options with args
    [
      ['--silent'],
      { default: { passWithNoTests: true } },
      ['--silent', '--pass-with-no-tests'],
    ],

    // Should merged default options with args
    [
      ['--fix', '.'],
      {
        alias: {
          config: 'c',
          format: 'f',
        },
        default: {
          cache: true,
          config: '/my/path/to/config.js',
          ext: ['.js', '.jsx', '.json'],
        },
      },
      [
        '--fix',
        '.',
        '--cache',
        '--config',
        '/my/path/to/config.js',
        '--ext',
        '.js',
        '--ext',
        '.jsx',
        '--ext',
        '.json',
      ],
    ],

    // Should merged default options with args, even when args is empty
    [
      [],
      {
        alias: { config: 'c' },
        default: {
          config: '/path/to/config/file.js',
          passWithNoTests: true,
          silent: true,
        },
      },
      [
        '--config',
        '/path/to/config/file.js',
        '--pass-with-no-tests',
        '--silent',
      ],
    ],

    // Shouldn't break if args and options are empty
    [[], {}, []],

    // Should return args when options is empty
    [['--config', 'my/config.js'], {}, ['--config', 'my/config.js']],

    // Arg values should take precedence over default options
    [
      ['--config', 'my/config.js'],
      {
        default: {
          config: 'path/to/config/file.js',
          silent: true,
        },
      },
      ['--config', 'my/config.js', '--silent'],
    ],

    // Aliased arg values should take precedence over default options
    [
      ['-c', 'my/config.js'],
      {
        alias: { config: 'c' },
        default: {
          config: 'path/to/config/file.js',
          passWithNoTests: true,
        },
      },
      ['--config', 'my/config.js', '--pass-with-no-tests'],
    ],
  ])('merges args %j with options %j', (args, options, expected) => {
    const result = mergeArgs(args, options)
    expect(result).toEqual(expected)
  })
})
