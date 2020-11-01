'use strict'

const debug = require('debug')('cli-rewire:run')
const execa = require('execa')

const defaultOptions = {
  buffer: false,
  localDir: __dirname,
  preferLocal: true,
  stdio: 'inherit',
}

/**
 * Runs the specified executable.
 *
 * @param {string} cmd Name of the executable to run
 * @param {string[]} [args] Arguments array
 * @param {object} [options] Options passed to execa
 * @returns {number} Resulting exit code from running executable
 *
 * @example
 * run('jest', ['--ci'])
 */
async function run(cmd, args = [], options = {}) {
  /** @type {object} */
  const mergedOptions = { ...defaultOptions, ...options }

  debug('run %s %o %o', cmd, args, mergedOptions)
  const child = execa(cmd, args, mergedOptions)

  const result = await child
  return result.exitCode
}

module.exports = run
