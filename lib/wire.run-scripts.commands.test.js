'use strict'

const runScripts = require('./run-scripts')
const wire = require('./wire')

jest.mock('./run-scripts')

/** @type {Object} */
const mockRun = runScripts

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

describe('wire: run-scripts: commands', () => {
  // Valid command cases
  it.each([
    {
      exitCode: 0,
      commands: { test: ['eslint --fix .', 'jest'] },
      processArgs: ['', '', 'test'],
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
        [
          {
            args: [],
            name: 'jest',
            options: {
              nodeArgs: [],
            },
            path: 'path/to/jest.js',
          },
        ],
      ],
    },
    {
      exitCode: 0,
      commands: { test: ['eslint --fix .', 'jest'] },
      processArgs: ['', '', 'test', '-u'],
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
        [
          {
            args: ['-u'],
            name: 'jest',
            options: {
              nodeArgs: [],
            },
            path: 'path/to/jest.js',
          },
        ],
      ],
    },
  ])('handles %j', async (config) => {
    mockRun.mockImplementation(() => Promise.resolve(config.exitCode))
    process.argv = config.processArgs

    const run = wire(scriptPaths, { commands: config.commands })
    await run()

    expect(mockRun).toHaveBeenCalledWith(config.expectedRunArgs)
    expect(process.exitCode).toBe(config.exitCode)
  })

  it('handles invalid command', async () => {
    mockRun.mockImplementation(() => Promise.resolve(0))
    process.argv = ['', '', 'asdf']

    const run = wire(scriptPaths)
    await run()

    expect(mockRun).not.toHaveBeenCalled()
    expect(process.exitCode).toBe(1)
  })
})
