'use strict'

/* eslint-disable no-console */

const debug = require('debug')('cli-rewire:wire')
const messages = require('./messages')
const path = require('path')
const parseScripts = require('./parse-scripts')
const runScripts = require('./run-scripts')

/**
 * @typedef WireOptions
 * @property {Object.<string.Array>} [commands] Map of command names to an array of script commands.
 */

/**
 * @param {string[]} scriptPaths Array of script paths.
 * @param {WireOptions} [options] Wire options.
 */
function wire(scriptPaths, options = {}) {
  // Get command object from options (if it exists).
  const customCommands = options.commands || {}

  // Convert array of script paths to a script map object.
  const scriptMap = scriptPaths.reduce((map, script) => {
    const name = path.basename(script, '.js')
    map[name] = script
    return map
  }, {})

  /**
   * Runs the wired up cli.
   */
  async function run() {
    let exitCode = 0
    try {
      debug('commands %j', customCommands)
      debug('scriptMap %O', scriptMap)

      // Build array of scripts to run.
      const rawScripts = []

      // Get potential script or command from process args.
      const args = process.argv.slice(2)
      debug('args %j', args)

      // Search args array for a script command or custom command.
      const isScript = (x) => x in scriptMap
      const isCustomCommand = (x) => x in customCommands
      const scriptIndex = args.findIndex(isScript)
      const commandIndex = args.findIndex(isCustomCommand)
      let index = null

      if (scriptIndex !== -1) {
        // If script command is found, add it to the queue.
        index = scriptIndex
        const script = args[index]
        debug('found script %s', script)
        rawScripts.push(script)
      } else if (commandIndex !== -1) {
        // If custom command is found, add its scripts to the queue.
        index = commandIndex
        const command = args[index]
        debug('found command %s', command)
        rawScripts.push(...customCommands[command])
      } else {
        // Command was unrecognized,
        // so alert the user and throw an error.
        const message = messages.invalidCommand(args.join(' '))
        console.log()
        console.log(message)
        console.log()
        throw new Error(message)
      }

      // Parse the scripts into a clean format.
      const scriptGroups = parseScripts(rawScripts, scriptMap)

      // Get Node args and command args.
      const nodeArgs = args.slice(0, index)
      const commandArgs = args.slice(index + 1)

      // Add Node args to every script.
      scriptGroups.forEach((group) => {
        group.forEach((script) => {
          script.options.nodeArgs = script.options.nodeArgs || []
          script.options.nodeArgs.push(...nodeArgs)
        })
      })

      // Add command args to the last script.
      const lastGroup = scriptGroups[scriptGroups.length - 1]
      const lastScript = lastGroup[lastGroup.length - 1]
      lastScript.args.push(...commandArgs)

      // Run the scripts.
      exitCode = await runScripts(scriptGroups)
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

  return run
}

module.exports = wire
