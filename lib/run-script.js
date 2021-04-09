'use strict'

/* eslint-disable no-console */

const debug = require('debug')('cli-rewire:run-script')
const messages = require('./messages')
const run = require('./run')
const time = require('debug')('cli-rewire:run-script:time')

/**
 * Run the given script.
 *
 * @param { import('./parse-script').Script } script Script to run
 * @returns {number} Resulting exit code from running script
 */
async function runScript({ name = '', path = '', args = [], options = {} }) {
  debug('%s %s %o %o', name, path, args, options)

  // Return error exit code if there's no path to run.
  if (!path) {
    console.log(messages.invalidCommand(name))
    console.log()
    return 1
  }

  console.log(messages.run(name))

  // Limit what options get passed to execa.
  const { env = {}, nodeArgs = [] } = options

  // Return error exit code if invalid Node args are found.
  const invalidNodeArgIndex = nodeArgs.findIndex(
    (nodeArg) => !nodeArg.startsWith('-')
  )
  if (invalidNodeArgIndex !== -1) {
    console.log(messages.invalidNodeArg(nodeArgs[invalidNodeArgIndex]))
    console.log()
    return 1
  }

  time('start %s', name)
  const result = await run('node', [...nodeArgs, path, ...args], {
    env: {
      ...env,
      ...process.env,
    },
    extendEnv: false,
  })
  time('end %s', name)

  // Add line break between scripts
  console.log()

  return result.exitCode
}

module.exports = runScript
