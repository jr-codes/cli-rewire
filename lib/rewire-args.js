'use strict'

const debug = require('debug')('cli-rewire:rewire-args')
const parse = require('yargs-parser')
const unparse = require('yargs-unparser')

/**
 * Infers unparseOptions from parseOptions.
 * @param {*} parseOptions yargs-parser options
 * @returns {Object} yargs-unparser options
 */
function inferUnparseOptions(parseOptions) {
  const options = {
    alias: parseOptions.alias || {},
    default: {},
  }

  parseOptions.boolean = parseOptions.boolean || []

  // parseOptions override the CLI's defaults.
  // unparseOptions should represent the CLI's defaults,
  // so set unparseOption's boolean defaults to the opposite of parseOptions.
  parseOptions.boolean.forEach((bool) => {
    options.default[bool] = !parseOptions.default[bool]
  })

  return options
}

/**
 * Applies yargs parsing to an args array and returns the result.
 *
 * This can be used to provide default values for any unspecified options
 * in the args array. See https://github.com/yargs/yargs-parser and
 * https://github.com/yargs/yargs-unparser for yargs options.
 *
 * @param {string[]} args Initial args array
 * @param {Object} [parseOptions] Options passed to yargs-parser
 * @param {Object} [unparseOptions] Options passed to yargs-unparser. unparseOptions will be
 * inferred automatically from parseOptions
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
function rewireArgs(args, parseOptions = {}, unparseOptions = {}) {
  debug('start %o %o %o', args, parseOptions, unparseOptions)

  const inferredUnparseOptions = inferUnparseOptions(parseOptions)
  debug('inferred unparseOptions %o', inferredUnparseOptions)

  const finalUnparseOptions = { ...inferredUnparseOptions, ...unparseOptions }
  debug('final unparseOptions %o', finalUnparseOptions)

  const finalArgs = unparse(parse(args, parseOptions), finalUnparseOptions)
  debug('end %o', finalArgs)

  return finalArgs
}

module.exports = rewireArgs
