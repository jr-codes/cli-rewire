'use strict'

/* eslint-disable max-lines-per-function */

const run = require('./run')
const wire = require('./wire')

jest.mock('./run')

/** @type {Object} */
const mockRun = run

const ARGV = process.argv

afterAll(() => {
  process.argv = ARGV
  process.exitCode = 0
})

describe('wire: run', () => {
  it.each([
    {
      processArgs: ['eslint'],
      scriptPaths: ['path/to/eslint.js'],
      expectedNodeArgs: ['path/to/eslint.js'],
    },
    {
      processArgs: ['--inspect-brk', 'jest'],
      scriptPaths: ['path/to/jest.js'],
      expectedNodeArgs: ['--inspect-brk', 'path/to/jest.js'],
    },
    {
      processArgs: ['eslint', '--fix', '.'],
      scriptPaths: ['path/to/eslint.js', 'path/to/nodemon.js'],
      expectedNodeArgs: ['path/to/eslint.js', '--fix', '.'],
    },
    {
      processArgs: ['--inspect', 'jest', '-i'],
      scriptPaths: ['path/to/eslint.js', 'path/to/jest.js'],
      expectedNodeArgs: ['--inspect', 'path/to/jest.js', '-i'],
    },
  ])('handles %j', async ({ processArgs, scriptPaths, expectedNodeArgs }) => {
    process.argv = ['', '', ...processArgs]

    const wiredRun = wire(scriptPaths)
    await wiredRun()

    expect(mockRun).toHaveBeenCalledWith(
      'node',
      expectedNodeArgs,
      expect.any(Object)
    )
  })

  it.each([
    {
      processArgs: ['eslint'],
      commands: {
        test: ['jest'],
      },
      scriptPaths: ['path/to/eslint.js', 'path/to/jest.js'],
      expectedNodeArgs: ['path/to/eslint.js'],
    },
    {
      processArgs: ['test'],
      commands: {
        lint: 'eslint .',
        test: ['jest'],
      },
      scriptPaths: ['path/to/eslint.js', 'path/to/jest.js'],
      expectedNodeArgs: ['path/to/jest.js'],
    },
    {
      processArgs: ['test', '-u'],
      commands: {
        test: ['jest'],
      },
      scriptPaths: ['path/to/eslint.js', 'path/to/jest.js'],
      expectedNodeArgs: ['path/to/jest.js', '-u'],
    },
    {
      processArgs: ['--inspect-brk', 'test', '--runInBand'],
      commands: {
        test: ['jest --ci'],
      },
      scriptPaths: ['path/to/eslint.js', 'path/to/jest.js'],
      expectedNodeArgs: [
        '--inspect-brk',
        'path/to/jest.js',
        '--ci',
        '--runInBand',
      ],
    },
    {
      processArgs: ['debug'],
      commands: {
        debug: [['jest -i', { nodeArgs: ['--inspect-brk'] }]],
      },
      scriptPaths: ['path/to/eslint.js', 'path/to/jest.js'],
      expectedNodeArgs: ['--inspect-brk', 'path/to/jest.js', '-i'],
    },
  ])(
    'handles %j',
    async ({ processArgs, commands, scriptPaths, expectedNodeArgs }) => {
      process.argv = ['', '', ...processArgs]

      const wiredRun = wire(scriptPaths, { commands })
      await wiredRun()

      expect(mockRun).toHaveBeenCalledWith(
        'node',
        expectedNodeArgs,
        expect.any(Object)
      )
    }
  )

  it('stops invalid Node args', async () => {
    process.argv = ['', '', 'myfile.js', 'nodemon']

    const wiredRun = wire(['path/to/nodemon.js'])
    await wiredRun()

    expect(mockRun).not.toHaveBeenCalled()
  })
})
