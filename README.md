# cli-rewire

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm](https://img.shields.io/npm/v/cli-rewire)](https://www.npmjs.com/package/cli-rewire)
[![CI](https://github.com/jr-codes/cli-rewire/workflows/CI/badge.svg)](https://github.com/jr-codes/cli-rewire/actions)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jr-codes/cli-rewire/blob/master/LICENSE)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/jr-codes/cli-rewire.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jr-codes/cli-rewire/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/jr-codes/cli-rewire.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jr-codes/cli-rewire/alerts/)

Make a CLI by rewiring other CLIs.

CLI Rewire is a tool that lets you take existing CLIs, reconfigure their options, and combine them together to form new commands. Using CLI Rewire, you can create CLI wrappers and toolchains like [Create React App's react-scripts](https://github.com/facebook/create-react-app/tree/master/packages/react-scripts), [Standard](https://github.com/standard/standard), [XO](https://github.com/xojs/xo), and [kcd-scripts](https://github.com/kentcdodds/kcd-scripts).

CLI Rewire internally uses [yargs](https://github.com/yargs/yargs-parser) to reconfigure args, [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to override configs, and [execa](https://github.com/sindresorhus/execa) to run CLIs.

## 🔧 Install

```sh
npm install cli-rewire
```

## 📝 Usage

First, `npm install` each CLI you want to rewire into you project.

Then, make a script file for each CLI. For example, if you wanted to rewire [Jest](https://github.com/facebook/jest) to use a custom config by default:

```js
// jest.js

const { getConfigPath, rewire } = require('cli-rewire')

// Uses yargs-parser to rewire args; see yargs-parser docs for options
const runJest = rewire({
  alias: {
    // Capture -c and --config
    config: 'c'
  },
  default: {
    // If --config or -c isn't provided, find the user's Jest config.
    // If not found, use /path/to/my/jest.config.js.
    config: getConfigPath('jest', {}, '/path/to/my/jest.config.js'))
  }
})

// Run Jest CLI
runJest()
```

After making your scripts, wire them together in your CLI's bin file.

```js
// my-cli.js

#!/usr/bin/env node

const { wire } = require('cli-rewire')

// Get script paths
const scripts = [
  './scripts/babel.js',
  './scripts/prettier.js',
  './scripts/jest.js',
  './scripts/webpack.js'
].map(require.resolve)

// Wire up the scripts together
const runCLI = wire(scripts, {
  // Combine CLI commands to form your own custom commands
  commands: {
    format: [
      'prettier --write .'
    ],
    'test-ci': [
      'prettier --check .',
      'jest --ci'
    ]
  }
})

runCLI()
```

If this were published as a `my-cli` package, these would be a few possible commands:

- `my-cli babel my-file.js`
- `my-cli prettier --check "src/**/*.js"`
- `my-cli jest --silent`
- `my-cli format`
- `my-cli test-ci --verbose`

Users of your CLI would be able to run any of the rewired tools, as well as any custom commands you specified.
