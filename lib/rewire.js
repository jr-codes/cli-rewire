'use strict'

const debug = require('debug')('cli-rewire:rewire')
const runWithYargs = require('./run-with-yargs')

/**
 * Returns a function that executes a command with default options
 * merged with process.argv. See https://github.com/yargs/yargs-parser for yargs options.
 *
 * @param {string} cmd Name of the executable to run
 * @param {Object} argOptions Yargs options https://github.com/yargs/yargs-parser
 * @returns {Function} command exec function
 *
 * @example
 * const nodemon = rewire('nodemon')
 *
 * // runs nodemon, passing all args from process.argv
 * nodemon()
 *
 * @example
 * const eslint = rewire('eslint', {
 *  alias: {
 *    config: 'c',
 *    format: 'f',
 *  },
 *  default: {
 *    config:  'path/to/my/config',
 *    format: 'pretty'
 *  }
 * })
 *
 * // runs eslint --config path/to/my/config --format pretty
 * // by default. Any args from process.argv will override these
 * // default args.
 * eslint()
 */
function rewire(cmd, argOptions = {}) {
  /**
   * Runs the executable with the specified exec options. See
   * https://github.com/sindresorhus/execa#options for execa options.
   * @param {Object} [execOptions] execa options https://github.com/sindresorhus/execa#options
   *
   * @example
   * run()
   *
   * @example
   * run({
   *  buffer: true,
   *  cleanup: false,
   * })
   */
  async function run(execOptions = {}) {
    let exitCode = 0
    try {
      exitCode = await runWithYargs(cmd, argOptions, execOptions)
    } catch (error) {
      debug(error)
      exitCode = 1
    } finally {
      process.exitCode = exitCode
    }
  }

  return run
}

module.exports = rewire
