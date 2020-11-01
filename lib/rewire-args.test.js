'use strict'

const rewireArgs = require('./rewire-args')

describe('rewire-args', () => {
  it.each([
    // Should apply default options to args
    [
      ['--silent'],
      { default: { passWithNoTests: true } },
      ['--silent', '--pass-with-no-tests'],
    ],

    // Should apply default options to args with aliases
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

    // Should apply default options to args, even when args is empty
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
  ])('rewires args %j with options %j', (args, options, expected) => {
    const result = rewireArgs(args, options)
    expect(result).toEqual(expected)
  })
})
