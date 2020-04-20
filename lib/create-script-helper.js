'use strict'

const debug = require('debug')('cli-rewire:script-helper')
const path = require('path')
const getConfigPath = require('./get-config-path')
const getIgnorePath = require('./get-ignore-path')
const runWithYargs = require('./run-with-yargs')

/**
 * Returns a helper utility used for configuring scripts.
 *
 * @param {string} defaultConfigPath Path where default config files are located.
 * @returns {Object} script helper
 */
function createScriptHelper(defaultConfigPath) {
  const getDefault = name => path.join(defaultConfigPath, name)

  return {
    /**
     * Searches for the given config file and returns the file path if found.
     * Otherwise, returns the default config path.
     *
     * @param {string} name Name of the config
     * @param {Object} [options] Options passed to cosmiconfig
     * @returns {string} Config path

     * @example
     * getConfig('prettier')
     *
     * @example
     * getConfig('eslint', { packageProps: 'eslintConfig' })
     *
     * @example
     * getConfig('webpack')
     */
    getConfig: (name, options) =>
      getConfigPath(name, options, getDefault(`${name}.js`)),

    /**
     * Searches for the given config file and returns the file path if found.
     * Otherwise, returns the default config path.
     *
     * @param {string} name Name of the config
     * @param {Object} [options] Options passed to cosmiconfig
     * @returns {string} Config path
     *
     * @example
     * getIgnore('.prettierignore')
     */
    getIgnore: (name, options) =>
      getIgnorePath(name, options, getDefault(name)),

    /**
     * Runs the specified executable with yargs options.
     *
     * @param {string} cmd Name of the executable to run
     * @param {Object} [args] Yargs options
     * @param {Object} [options] Options passed to execa
     * @returns {number} Resulting exit code from running executable
     *
     * @example
     * run('jest', { default: { silent: true }})
     */
    run: async (cmd, args, options) => {
      try {
        const exitCode = await runWithYargs(cmd, args, options)
        process.exitCode = exitCode
      } catch (error) {
        debug(error)
        process.exitCode = 1
      }
    },
  }
}

module.exports = createScriptHelper
