'use strict'

const runScripts = require('./run-scripts')
const wire = require('./wire')

jest.mock('./run-scripts')

/** @type {Object} */
const mockRun = runScripts

const ARGV = process.argv

afterAll(() => {
  // These tests modify process vars,
  // so reset them after the tests are run.
  process.argv = ARGV
  process.exitCode = 0
})

const scriptPaths = [
  'path/to/webpack.js',
  'path/to/eslint.js',
  'path/to/nodemon.js',
  'path/to/jest.js',
]

describe('wire: scripts', () => {
  // Valid script cases
  it.each([
    {
      exitCode: 0,
      processArgs: ['', '', 'eslint'],
      expectedRunArgs: [
        [
          {
            args: [],
            name: 'eslint',
            nodeArgs: [],
            options: {},
            path: 'path/to/eslint.js',
          },
        ],
      ],
    },
    {
      exitCode: 0,
      processArgs: ['', '', 'eslint', '--fix', '.'],
      expectedRunArgs: [
        [
          {
            args: ['--fix', '.'],
            name: 'eslint',
            nodeArgs: [],
            options: {},
            path: 'path/to/eslint.js',
          },
        ],
      ],
    },
    {
      exitCode: 0,
      processArgs: ['', '', '--inspect-brk', 'jest', '-i'],
      expectedRunArgs: [
        [
          {
            args: ['-i'],
            name: 'jest',
            nodeArgs: ['--inspect-brk'],
            options: {},
            path: 'path/to/jest.js',
          },
        ],
      ],
    },
    {
      exitCode: 1,
      processArgs: ['', '', 'nodemon'],
      expectedRunArgs: [
        [
          {
            args: [],
            name: 'nodemon',
            nodeArgs: [],
            options: {},
            path: 'path/to/nodemon.js',
          },
        ],
      ],
    },
  ])('handles %j', async (config) => {
    mockRun.mockImplementation(() => Promise.resolve(config.exitCode))
    process.argv = config.processArgs

    const run = wire(scriptPaths)
    await run()

    expect(mockRun).toHaveBeenCalledWith(config.expectedRunArgs)
    expect(process.exitCode).toBe(config.exitCode)
  })
})

describe('wire: commands', () => {
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
            nodeArgs: [],
            options: {},
            path: 'path/to/eslint.js',
          },
        ],
        [
          {
            args: [],
            name: 'jest',
            nodeArgs: [],
            options: {},
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
            nodeArgs: [],
            options: {},
            path: 'path/to/eslint.js',
          },
        ],
        [
          {
            args: ['-u'],
            name: 'jest',
            nodeArgs: [],
            options: {},
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
