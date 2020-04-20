'use strict'

const runScript = require('./run-script')
const run = require('./run')

jest.mock('./run')

/** @type {Object} */
const mockRun = run

describe('run-script', () => {
  it('runs script', async () => {
    mockRun.mockImplementation(() => Promise.resolve(0))
    const script = {
      name: 'webpack',
      path: 'path/to/webpack',
      args: [],
      options: {},
    }

    await expect(runScript(script)).resolves.toBe(0)
    expect(run).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([script.path]),
      expect.any(Object)
    )
  })

  it("returns with script's exit code", async () => {
    mockRun.mockImplementation(() => Promise.resolve(2))
    const script = {
      name: 'prettier',
      path: 'a/b/c.js',
      args: [],
      options: {},
    }

    const result = await runScript(script)

    expect(run).toHaveBeenCalled()
    expect(result).toBe(2)
  })

  it('runs script with args', async () => {
    mockRun.mockImplementation(() => Promise.resolve(0))
    const script = {
      name: 'eslint',
      path: 'path/to/eslint',
      args: ['.', '--fix'],
      options: {},
    }
    const result = await runScript(script)

    expect(result).toBe(0)
    expect(run).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([script.path, ...script.args]),
      expect.any(Object)
    )
  })

  it('runs script with env', async () => {
    mockRun.mockImplementation(() => Promise.resolve(0))
    const script = {
      name: 'babel',
      path: 'e/f/g',
      args: [],
      options: { env: { BABEL_ENV: 'produciton' } },
    }

    const result = await runScript(script)

    expect(result).toBe(0)
    expect(run).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([script.path, ...script.args]),
      expect.objectContaining({ env: script.options.env })
    )
  })

  it('runs script with args and env', async () => {
    mockRun.mockImplementation(() => Promise.resolve(0))
    const script = {
      name: 'jest',
      path: 'some/path/to/jest',
      args: ['--ci'],
      options: { env: { BABEL_ENV: 'test', NODE_ENV: 'test' } },
    }

    const result = await runScript(script)

    expect(result).toBe(0)
    expect(run).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([script.path, ...script.args]),
      expect.objectContaining({ env: script.options.env })
    )
  })

  it("doesn't run invalid script", async () => {
    mockRun.mockImplementation(() => Promise.resolve(0))

    const result = await runScript('foo')

    expect(run).not.toHaveBeenCalled()
    expect(result).not.toBe(0)
  })
})
