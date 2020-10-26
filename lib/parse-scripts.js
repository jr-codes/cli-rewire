'use strict'

const debug = require('debug')('cli-rewire:parse-scripts')
const parseScript = require('./parse-script')

/**
 * @typedef { import('./parse-script').Script } Script
 */

/**
 * Parses an array of raw script commands and returns a 2D array
 * of script objects that can be passed to `runScripts`.
 *
 * @param {Array.<string | Array>} rawScripts Array of raw script commands
 * @param {Object.<string,string>} scriptMap Map of script names to script paths
 * @returns {Script[][]} array of script arrays
 *
 * @example
 * parseScripts(['jest', 'eslint --fix .'], { eslint: 'path/to/eslint', jest: 'path/to/jest' })
 * // Returns [
 * //   [{ name: 'jest', path: 'path/to/jest', args: [], options: {} }],
 * //   [{ name: 'eslint', path: 'path/to/eslint', args: ['--fix', '.'], options: {} }]
 * // ]
 */
function parseScripts(rawScripts, scriptMap) {
  debug('start %j %O', rawScripts, scriptMap)

  /** @type {Script[][]} */
  const groups = [[]]

  let group = groups[0]

  rawScripts.forEach((rawScript, i) => {
    const script = parseScript(rawScript, scriptMap)
    const hasNext = i !== rawScripts.length - 1

    // Add script to the latest group in the array
    group.push(script)

    // If this script shouldn't run in parallel with the next script,
    // (and if there is a next script),
    // create a new group for the next script to be added to.
    if (!script.options.runWithNext && hasNext) {
      group = []
      groups.push(group)
    }
  })

  debug('end %j', groups)
  return groups
}

module.exports = parseScripts
