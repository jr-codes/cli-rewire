'use strict'

const debug = require('debug')('cli-rewire:get-config')
const findConfig = require('./find-config')

/**
 * Searches for the given config file and returns the config object if found.
 *
 * @param {string} name Name of the config
 * @param {Object} options Options passed to cosmiconfig
 * @param {string} defaultConfigPath Default config path to use if config isn't found.
 * @returns {Object | null} Config object, or null if not found
 *
 * @example
 * getConfig('prettier')
 *
 * @example
 * getConfig('eslint', { packageProps: 'eslintConfig' })
 *
 * @example
 * getConfig('u', {}, './defaults/u.js')
 */
function getConfig(name, options = {}, defaultConfigPath = '') {
  const result = findConfig(name, options, defaultConfigPath)
  if (result) {
    debug('%s config loaded', name)
    return result.config
  }
  debug('no config found for %s', name)
  return null
}

module.exports = getConfig
