'use strict'

const mergeArgs = require('./merge-args')
const run = require('./run')

/**
 * Runs the specified executable with yargs options.
 *
 * @param {string} cmd Name of the executable to run
 * @param {Object} [args] Yargs options
 * @param {Object} [options] Options passed to execa
 * @returns {number} Resulting exit code from running executable
 *
 * @example
 * runWithYargs('jest', { default: { silent: true }})
 */
function runWithYargs(cmd, args = {}, options = {}) {
  return run(cmd, mergeArgs(process.argv.slice(2), args), options)
}

module.exports = runWithYargs
