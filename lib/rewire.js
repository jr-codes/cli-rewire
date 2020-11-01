'use strict'

const debug = require('debug')('cli-rewire:rewire')
const rewireArgs = require('./rewire-args')
const run = require('./run')

/**
 * Returns a function that executes a command with default options
 * merged with process.argv. See https://github.com/yargs/yargs-parser and
 * https://github.com/yargs/yargs-unparser for yargs options.
 *
 * @param {string} cmd Name of the executable to run
 * @param {Object} parseArgsOptions Options for yargs-parser
 * @param {Object} unparseArgsOptions Options for yargs-unparser
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
function rewire(cmd, parseArgsOptions = {}, unparseArgsOptions = {}) {
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
  async function runRewire(execOptions = {}) {
    let exitCode = 0
    try {
      // Apply yargs options to user's arg
      const args = rewireArgs(
        process.argv.slice(2),
        parseArgsOptions,
        unparseArgsOptions
      )

      // Run command with new args and execa options
      exitCode = await run(cmd, args, execOptions)
    } catch (error) {
      debug(error)
      exitCode = 1
    } finally {
      // Before exit, set the exit code based on script runs.

      // This ESLint rule is giving a false positive here, so disable it.
      // eslint-disable-next-line require-atomic-updates
      process.exitCode = exitCode
    }
  }

  return runRewire
}

module.exports = rewire
