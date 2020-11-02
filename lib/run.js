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
 * @returns {object} Execa result object
 *
 * @example
 * run('jest', ['--ci'])
 */
function run(cmd, args = [], options = {}) {
  /** @type {object} */
  const mergedOptions = { ...defaultOptions, ...options }

  debug('run %s %o %o', cmd, args, mergedOptions)
  return execa(cmd, args, mergedOptions)
}

module.exports = run
