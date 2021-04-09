'use strict'

const execa = require('execa')
const run = require('../run')

jest.mock('execa')

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

describe('run', () => {
  it('calls execa', async () => {
    execa.mockResolvedValue(mockExecaResult({ exitCode: 0 }))
    const cmd = 'echo'
    const args = ['test']
    const options = {
      env: {
        ENV: 123,
      },
    }

    const result = await run(cmd, args, options)
    expect(result.exitCode).toBe(0)
    expect(execa).toHaveBeenLastCalledWith(
      cmd,
      args,
      expect.objectContaining(options)
    )
  })

  it('calls execa with no args', async () => {
    execa.mockResolvedValue(mockExecaResult({ exitCode: 0 }))
    const cmd = 'prettier'

    const result = await run(cmd)
    expect(result.exitCode).toBe(0)
    expect(execa).toHaveBeenLastCalledWith(cmd, [], expect.anything())
  })

  it('returns failure exit code on execa failure', async () => {
    execa.mockRejectedValue(new Error('error'))
    const cmd = 'echo'
    const args = ['test']
    const options = {
      env: {
        ENV: 123,
      },
    }

    await expect(run(cmd, args, options)).rejects.toThrow()
    expect(execa).toHaveBeenLastCalledWith(
      cmd,
      args,
      expect.objectContaining(options)
    )
  })

  it('returns exit code from execa', async () => {
    execa.mockResolvedValue(mockExecaResult({ exitCode: 42 }))
    const cmd = 'echo'
    const args = ['test']
    const options = {
      env: {
        ENV: 123,
      },
    }

    const result = await run(cmd, args, options)
    expect(result.exitCode).toBe(42)
    expect(execa).toHaveBeenLastCalledWith(
      cmd,
      args,
      expect.objectContaining(options)
    )
  })
})
