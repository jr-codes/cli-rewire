'use strict'

const rewireArgs = require('./rewire-args')
const run = require('./run')

/**
 * Runs the specified executable with yargs options.
 *
 * @param {string} cmd Name of the executable to run
 * @param {Object} [argOptions] Yargs options
 * @param {Object} [execOptions] Options passed to execa
 * @returns {number} Resulting exit code from running executable
 *
 * @example
 * runWithYargs('jest', { default: { silent: true }})
 */
function runWithYargs(cmd, argOptions = {}, execOptions = {}) {
  return run(cmd, rewireArgs(process.argv.slice(2), argOptions), execOptions)
}

module.exports = runWithYargs
