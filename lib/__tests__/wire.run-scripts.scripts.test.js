'use strict'

const runScripts = require('../run-scripts')
const wire = require('../wire')

jest.mock('../run-scripts')

/** @type {Object} */
const mockRunScripts = runScripts

const ARGV = process.argv

const scriptPaths = [
  'path/to/webpack.js',
  'path/to/eslint.js',
  'path/to/nodemon.js',
  'path/to/jest.js',
]

afterAll(() => {
  // These tests modify process vars,
  // so reset them after the tests are run.
  process.argv = ARGV
  process.exitCode = 0
})

describe('wire: run-scripts: scripts', () => {
  // Valid script cases
  it.each([
    {
      exitCode: 0,
      processArgs: ['eslint'],
      expectedRunArgs: [
        [
          {
            args: [],
            name: 'eslint',
            options: {
              nodeArgs: [],
            },
            path: 'path/to/eslint.js',
          },
        ],
      ],
    },
    {
      exitCode: 0,
      processArgs: ['eslint', '--fix', '.'],
      expectedRunArgs: [
        [
          {
            args: ['--fix', '.'],
            name: 'eslint',
            options: {
              nodeArgs: [],
            },
            path: 'path/to/eslint.js',
          },
        ],
      ],
    },
    {
      exitCode: 0,
      processArgs: ['--inspect-brk', 'jest', '-i'],
      expectedRunArgs: [
        [
          {
            args: ['-i'],
            name: 'jest',
            options: {
              nodeArgs: ['--inspect-brk'],
            },
            path: 'path/to/jest.js',
          },
        ],
      ],
    },
    {
      exitCode: 1,
      processArgs: ['nodemon'],
      expectedRunArgs: [
        [
          {
            args: [],
            name: 'nodemon',
            options: {
              nodeArgs: [],
            },
            path: 'path/to/nodemon.js',
          },
        ],
      ],
    },
  ])('handles %j', async (config) => {
    mockRunScripts.mockImplementation(() => Promise.resolve(config.exitCode))
    process.argv = ['', '', ...config.processArgs]

    const run = wire(scriptPaths)
    await run()

    expect(mockRunScripts).toHaveBeenCalledWith(config.expectedRunArgs)
    expect(process.exitCode).toBe(config.exitCode)
  })
})
