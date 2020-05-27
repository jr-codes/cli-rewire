'use strict'

const execa = require('execa')
const run = require('./run')

jest.mock('execa')

const mockExeca = execa

const buildReturnValue = (props) =>
  Promise.resolve({
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
    mockExeca.mockImplementation(() => buildReturnValue({ exitCode: 0 }))
    const cmd = 'echo'
    const args = ['test']
    const options = {
      env: {
        ENV: 123,
      },
    }

    const result = await run(cmd, args, options)
    expect(result).toBe(0)
    expect(mockExeca).toHaveBeenLastCalledWith(
      cmd,
      args,
      expect.objectContaining(options)
    )
  })

  it('returns failure exit code on execa failure', async () => {
    mockExeca.mockImplementation(() => Promise.reject(new Error('error')))
    const cmd = 'echo'
    const args = ['test']
    const options = {
      env: {
        ENV: 123,
      },
    }

    await expect(run(cmd, args, options)).rejects.toThrow()
    expect(mockExeca).toHaveBeenLastCalledWith(
      cmd,
      args,
      expect.objectContaining(options)
    )
  })

  it('returns exit code from execa', async () => {
    mockExeca.mockImplementation(() => buildReturnValue({ exitCode: 42 }))
    const cmd = 'echo'
    const args = ['test']
    const options = {
      env: {
        ENV: 123,
      },
    }

    const result = await run(cmd, args, options)
    expect(result).toBe(42)
    expect(mockExeca).toHaveBeenLastCalledWith(
      cmd,
      args,
      expect.objectContaining(options)
    )
  })
})
