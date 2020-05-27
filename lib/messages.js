'use strict'

const chalk = require('chalk')

module.exports = {
  invalidCommand: (command) =>
    chalk`{red ERROR} Invalid command {red ${command}}`,
  run: (name) => chalk`{bold.green RUN} ${name}`,
}
