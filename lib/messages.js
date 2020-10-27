'use strict'

const chalk = require('chalk')

module.exports = {
  invalidCommand: (command) =>
    chalk`{red ERROR} Invalid command {red ${command}}`,
  invalidNodeArg: (arg) => chalk`{red ERROR} Invalid Node arg {red ${arg}}`,
  run: (name) => chalk`{bold.green RUN} ${name}`,
}
