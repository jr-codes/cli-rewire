'use strict'

const findConfig = require('./find-config')

/**
 * Searches for the given config file and returns the file path if found.
 *
 * @param {string} name Name of the config
 * @param {Object} options Options passed to cosmiconfig
 * @param {string} defaultConfigPath Default config path to use if config isn't found.
 * @returns {string | null} Config path, or null if not found
 *
 * @example
 * getConfigPath('prettier')
 *
 * @example
 * getConfigPath('eslint', { packageProps: 'eslintConfig' })
 *
 * @example
 * getConfigPath('webpack', {}, '../default-webpack.config.js')
 */
function getConfigPath(name, options = {}, defaultConfigPath = '') {
  const result = findConfig(name, options, defaultConfigPath)
  return result ? result.filepath : null
}

module.exports = getConfigPath
