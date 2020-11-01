'use strict'

/* eslint-disable max-params */

const rewireArgs = require('./rewire-args')

test.each([
  // Should apply default options to args
  [
    ['--silent'],
    {
      boolean: ['pass-with-no-tests'],
      default: { 'pass-with-no-tests': true },
    },
    {},
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
      array: ['ext'],
      boolean: ['cache'],
      default: {
        cache: true,
        config: '/my/path/to/config.js',
        ext: ['.js', '.jsx'],
      },
    },
    {},
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
    ],
  ],

  // Should apply default options to args, even when args is empty
  [
    [],
    {
      alias: { config: 'c' },
      boolean: ['pass-with-no-tests', 'silent'],
      default: {
        config: '/path/to/config/file.js',
        'pass-with-no-tests': true,
        silent: true,
      },
    },
    {},
    ['--config', '/path/to/config/file.js', '--pass-with-no-tests', '--silent'],
  ],

  // Shouldn't break if args and options are empty
  [[], {}, {}, []],

  // Shouldn't break if parseOptions is undefined
  [[], undefined, {}, []],

  // Shouldn't break if unparseOptions is undefined
  [[], {}, undefined, []],

  // Shouldn't break if no options are undefined
  [[], undefined, undefined, []],

  // Should return args when options is empty
  [['--config', 'my/config.js'], {}, {}, ['--config', 'my/config.js']],

  // Arg values should take precedence over default options
  [
    ['--config', 'my/config.js'],
    {
      boolean: ['silent'],
      default: {
        config: 'path/to/config/file.js',
        silent: true,
      },
    },
    {},
    ['--config', 'my/config.js', '--silent'],
  ],

  // Aliased arg values should take precedence over default options
  [
    ['-c', 'my/config.js'],
    {
      alias: { config: 'c' },
      boolean: ['pass-with-no-tests'],
      default: {
        config: 'path/to/config/file.js',
        'pass-with-no-tests': true,
      },
    },
    {},
    ['--config', 'my/config.js', '--pass-with-no-tests'],
  ],

  // Boolean arg values should cancel out default boolean values
  [
    ['--no-silent', '--cache=false', '--pass-with-no-tests', '--verbose=true'],
    {
      boolean: ['cache', 'pass-with-no-tests', 'silent', 'verbose'],
      default: {
        cache: true,
        'pass-with-no-tests': false,
        silent: true,
        verbose: false,
      },
    },
    {},
    [],
  ],
])(
  'rewires args %j with parseOptions %j and unparseOptions %j',
  (args, parseOptions, unparseOptions, expected) => {
    const result = rewireArgs(args, parseOptions, unparseOptions)
    expect(result).toEqual(expected)
  }
)
