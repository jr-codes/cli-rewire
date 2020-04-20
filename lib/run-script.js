'use strict'

/* eslint-disable no-console */

const debug = require('debug')('cli-rewire:run-script')
const messages = require('./messages')
const run = require('./run')
const time = require('debug')('cli-rewire:time')

/**
 * Run the given script.
 *
 * @param { import('./parse-script').Script } script Script to run
 * @returns {number} Resulting exit code from running script
 */
async function runScript({ name = '', path = '', args = [], options = {} }) {
  debug('%s %s %o %o', name, path, args, options)

  if (!path) {
    console.log(messages.invalidCommand(name))
    console.log()
    return 1
  }

  console.log(messages.run(name))

  // Limit what options get passed to execa
  const { env } = options

  time('start %s', name)
  const exitCode = await run('node', [path, ...args], { env })
  time('end %s', name)

  // Add line break between scripts
  console.log()

  return exitCode
}

module.exports = runScript
