'use strict'

const rewire = require('./rewire')
const runWithYargs = require('./run-with-yargs')

jest.mock('./run-with-yargs')

/** @type {Object} */
const mockRun = runWithYargs

describe('rewire', () => {
  it('command', async () => {
    mockRun.mockImplementation(() => Promise.resolve(5))
    const name = 'nodemon'

    const run = rewire(name)
    await run()

    expect(mockRun).toHaveBeenCalledWith(
      name,
      expect.any(Object),
      expect.any(Object)
    )
  })

  it('command + argOptions', async () => {
    mockRun.mockImplementation(() => Promise.resolve(0))
    const name = 'eslint'
    const argOptions = {
      alias: {
        config: 'c',
        format: 'f',
      },
      default: {
        config: 'path/to/my/config',
        format: 'pretty',
      },
    }

    const run = rewire(name, argOptions)
    await run()

    expect(mockRun).toHaveBeenCalledWith(
      name,
      expect.objectContaining(argOptions),
      expect.any(Object)
    )
  })

  it('command + execOptions', async () => {
    mockRun.mockImplementation(() => Promise.resolve(2))
    const name = 'jest'
    const execOptions = {
      buffer: true,
      cleanup: false,
    }

    const run = rewire(name)
    await run(execOptions)

    expect(mockRun).toHaveBeenCalledWith(
      name,
      expect.any(Object),
      expect.objectContaining(execOptions)
    )
  })

  it('command + argOptions + execOptions', async () => {
    mockRun.mockImplementation(() => Promise.resolve(1))
    const name = 'eslint'
    const argOptions = {
      default: {
        cache: true,
        noEslintrc: true,
      },
    }

    const execOptions = {
      preferLocal: true,
    }

    const run = rewire(name, argOptions)
    await run(execOptions)

    expect(mockRun).toHaveBeenCalledWith(
      name,
      expect.objectContaining(argOptions),
      expect.objectContaining(execOptions)
    )
  })

  it('does not throw', async () => {
    mockRun.mockImplementation(() => Promise.reject(new Error('error')))
    const name = 'nodemon'

    const run = rewire(name)

    await expect(run()).resolves.not.toThrow()
  })
})
