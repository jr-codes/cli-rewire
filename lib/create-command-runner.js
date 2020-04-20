'use strict'

/* eslint-disable no-console */

const debug = require('debug')('cli-rewire:command-runner')
const messages = require('./messages')
const parseScripts = require('./parse-scripts')
const runScripts = require('./run-scripts')

/**
 * Returns a runner utility used for running commands.
 *
 * @param {object} options
 * @param {Object.<string,Array>} options.commands Map of command names to an array of script commands.
 * @param {Object.<string,string>} options.scriptMap Map of script names to file paths.
 * @returns {Function} command runner
 */
function createCommandRunner({ commands = {}, scriptMap = {} }) {
  /**
   * Runs the given argument and returns the resulting exit code.
   *
   * The argument must match a command from u's config,
   * or it must match a supported script name.
   * Otherwise, an error exit code is returned.
   *
   * @param {string} arg Argument to run
   * @returns {number} Exit code
   *
   * @example
   * run('eslint --fix .')
   *
   * @example
   * run('build')
   */
  async function run(arg) {
    debug('commands %j', commands)
    debug('scriptMap %O', scriptMap)

    const rawScripts = []

    // Check if first word matches a script name
    const argHead = arg.split(' ')[0]

    // If arg is a script, add script to the queue
    // Else if arg is a command, add command's scripts to the queue
    // Else, exit with an error code
    if (argHead in scriptMap) {
      debug('found script %s', argHead)
      rawScripts.push(arg)
    } else if (arg in commands) {
      debug('found command %s', arg)
      rawScripts.push(...commands[arg])
    } else {
      console.log()
      console.log(messages.invalidCommand(arg))
      console.log()
      return 1
    }

    const scripts = parseScripts(rawScripts, scriptMap)
    const exitCode = await runScripts(scripts)
    return exitCode
  }

  return run
}

module.exports = createCommandRunner
