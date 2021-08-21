'use strict'

const debug = require('debug')('cli-rewire:parse-script')
const tokenize = require('./tokenize')

/**
 * @typedef {Object} ScriptOptions Options used when running a script
 * @property {Object.<string,string>} env Key-value map of environment variables to send to the script
 * @property {boolean} runWithNext Indicates that this script should run in parallel with the next script
 */

/**
 * @typedef {Object} Script script object
 * @property {string} name Name of the script
 * @property {string} path Path to the script file
 * @property {string[]} args Arguments to pass to the script
 * @property {ScriptOptions} options Script options
 */

/**
 * Parses a script command and returns a script object
 * that can be passed to `runScript`.
 *
 * @param {string | Array} rawScript Script command
 * @param {Object.<string,string>} scriptMap Map of script names to script paths
 * @returns {Script} script object
 *
 * @example
 * parseScript('jest', { jest: 'path/to/jest' })
 * // Returns { name: 'jest', path: 'path/to/jest', args: [], options: {}}
 *
 * @example
 * parseScript('eslint --fix .', { eslint: 'path/to/eslint' })
 * // Returns { name: 'eslint', path: 'path/to/eslint', args: ['--fix', '.'], options: {}}
 *
 * @example
 * parseScript(['webpack', { env: { NODE_ENV: 'production' }}], { webpack: 'path/to/webpack' })
 * // Returns { name: 'webpack', path: 'path/to/webpack', args: [], options: { env: { NODE_ENV: 'production' }}
 */
function parseScript(rawScript, scriptMap) {
  debug('start %o %O', rawScript, scriptMap)

  // If rawScript is a command string, turn it into an array
  const script = typeof rawScript === 'string' ? [rawScript] : rawScript

  // Split the script command string into its name and arg parts
  const [name, ...args] = tokenize(script[0])

  /** @type {Script} */
  const parsedScript = {
    name,
    path: scriptMap[name],
    args,
    options: script[1] || {},
  }

  debug('end %j', parsedScript)
  return parsedScript
}

module.exports = parseScript
