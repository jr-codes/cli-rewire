'use strict'

const findConfig = require('./find-config')

const loaders = {
  noExt: (filepath, content) => ({ filepath, content }),
}

/**
 * Searches for the given config file and returns the file path if found.
 *
 * @param {string} name Name of the config
 * @param {Object} options Options passed to cosmiconfig
 * @param {string} defaultConfigPath Default config path to use if config isn't found.
 * @returns {string | null} Config path, or null if not found
 *
 * @example
 * getIgnorePath('.prettierignore')
 */
function getIgnorePath(name, options = {}, defaultConfigPath = '') {
  const ignoreOptions = { loaders, searchPlaces: [name], ...options }
  const result = findConfig(name, ignoreOptions, defaultConfigPath)
  return result ? result.filepath : null
}

module.exports = getIgnorePath
