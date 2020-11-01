'use strict'

const debug = require('debug')('cli-rewire:rewire-args')
const parse = require('yargs-parser')
const unparse = require('yargs-unparser')

/**
 * Applies yargs parsing to an args array and returns the result.
 *
 * This can be used to provide default values for any unspecified options
 * in the args array.
 *
 * @param {string[]} args Initial args array
 * @param {Object} options Options passed to yargs-parser
 * @returns {string[]} Final args array
 *
 * @example
 * rewireArgs(['--silent'], { default: { passWithNoTests: true } })
 * // returns ['--silent', '--pass-with-no-tests']
 *
 * @example
 * rewireArgs(['--config', 'my/config.js'], { default: { config: 'path/to/config/file.js' }})
 * // returns ['--config', 'my/config.js']
 */
function rewireArgs(args, options) {
  debug('start %o %o', args, options)
  const finalArgs = unparse(parse(args, options), {
    alias: options.alias || {},
  })
  debug('end %o', finalArgs)
  return finalArgs
}

module.exports = rewireArgs
