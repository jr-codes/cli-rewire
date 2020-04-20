'use strict'

const debug = require('debug')('cli-rewire:run-scripts')
const runScript = require('./run-script')

/**
 * Runs the given groups of scripts.
 * Scripts in the same group are run in parallel.
 *
 * @param {Script[][]} groups 2D array of scripts to run
 */
async function runScripts(groups) {
  debug('%j', groups)

  // Run each group sequentially
  for (const group of groups) {
    // Run each script in a group concurrently
    const results = await Promise.all(group.map(script => runScript(script))) // eslint-disable-line no-await-in-loop

    // If any of the scripts return a non-zero exit code, exit early.
    if (results.some(Boolean)) {
      return 1
    }
  }

  return 0
}

module.exports = runScripts
