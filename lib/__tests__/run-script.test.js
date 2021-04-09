'use strict'

/* eslint-disable max-lines-per-function */

const runScript = require('../run-script')
const run = require('../run')

jest.mock('../run')

const mockExecaResult = (props) => ({
  command: null,
  exitCode: null,
  failed: null,
  killed: null,
  stdout: null,
  stderr: null,
  timedOut: null,
  ...props,
})

describe('run-script', () => {
  it('runs script', async () => {
    run.mockResolvedValue(mockExecaResult({ exitCode: 0 }))
    const script = {
      name: 'webpack',
      path: 'path/to/webpack',
      args: [],
      options: {},
    }

    const result = await runScript(script)

    expect(result).toBe(0)
    expect(run).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([script.path]),
      expect.any(Object)
    )
  })

  it("returns with script's exit code", async () => {
    run.mockResolvedValue(mockExecaResult({ exitCode: 2 }))
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
    run.mockResolvedValue(mockExecaResult({ exitCode: 0 }))
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
    run.mockResolvedValue(mockExecaResult({ exitCode: 0 }))
    const script = {
      name: 'babel',
      path: 'e/f/g',
      args: [],
      options: { env: { BABEL_ENV: 'production' } },
    }

    const result = await runScript(script)

    expect(result).toBe(0)
    expect(run).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([script.path, ...script.args]),
      expect.objectContaining({
        env: expect.objectContaining(script.options.env),
      })
    )
  })

  it('runs script with args and env', async () => {
    run.mockResolvedValue(mockExecaResult({ exitCode: 0 }))
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
      expect.objectContaining({
        env: expect.objectContaining(script.options.env),
      })
    )
  })

  it('handles invalid script (bad params)', async () => {
    run.mockResolvedValue(mockExecaResult({ exitCode: 0 }))

    const result = await runScript('foo')

    expect(run).not.toHaveBeenCalled()
    expect(result).not.toBe(0)
  })

  it('handles invalid script (no path)', async () => {
    run.mockResolvedValue(mockExecaResult({ exitCode: 0 }))

    const result = await runScript({ name: 'jest' })

    expect(run).not.toHaveBeenCalled()
    expect(result).not.toBe(0)
  })

  it('handles invalid script (invalid nodeArgs)', async () => {
    run.mockResolvedValue(mockExecaResult({ exitCode: 0 }))

    const result = await runScript({
      name: 'jest',
      path: 'path/to/jest',
      options: { nodeArgs: ['invalid'] },
    })

    expect(run).not.toHaveBeenCalled()
    expect(result).not.toBe(0)
  })
})
