'use strict'

const parse = require('yargs-parser')
const unparse = require('yargs-unparser')

/**
 * Parses the given args array with the given yargs-parser options
 * and returns the resulting args array.
 *
 * @param {Array} initialArgs Initial args array
 * @param {Object} options Options passed to yargs-parser
 * @returns {Array} Final args array
 *
 * @example
 * mergeArgs(['--silent'], { default: { passWithNoTests: true } })
 * // returns ['--silent', '--pass-with-no-tests']
 */
function mergeArgs(args, options) {
  return unparse(parse(args, options), { alias: options.alias })
}

module.exports = mergeArgs
