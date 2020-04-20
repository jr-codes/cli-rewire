'use strict'

const runScript = require('./run-script')
const runScripts = require('./run-scripts')

jest.mock('./run-script')

/** @type {Object} */
const mockRunScript = runScript

describe('run-scripts', () => {
  it('runs scripts', async () => {
    mockRunScript.mockImplementation(() => Promise.resolve(0))
    const scripts = [['a']]

    const result = await runScripts(scripts)

    expect(result).toBe(0)
    expect(runScript).toHaveBeenCalledTimes(1)
    expect(runScript).toHaveBeenCalledWith('a')
  })

  it('runs all scripts in a group concurrently', async () => {
    mockRunScript.mockImplementation(() => Promise.resolve(0))
    const scripts = [['a', 'b', 'c']]

    const result = await runScripts(scripts)

    expect(result).toBe(0)
    expect(runScript).toHaveBeenCalledTimes(3)
    expect(runScript).toHaveBeenNthCalledWith(1, 'a')
    expect(runScript).toHaveBeenNthCalledWith(2, 'b')
    expect(runScript).toHaveBeenNthCalledWith(3, 'c')
  })

  it('runs each group of scripts sequentially', async () => {
    mockRunScript.mockImplementation(() => Promise.resolve(0))
    const scripts = [['a'], ['b'], ['c']]

    const result = await runScripts(scripts)

    expect(result).toBe(0)
    expect(runScript).toHaveBeenCalledTimes(3)
    expect(runScript).toHaveBeenNthCalledWith(1, 'a')
    expect(runScript).toHaveBeenNthCalledWith(2, 'b')
    expect(runScript).toHaveBeenNthCalledWith(3, 'c')
  })

  it('runs groups sequentially while running scripts in each group concurrently', async () => {
    mockRunScript.mockImplementation(() => Promise.resolve(0))
    const scripts = [
      ['a', 'b'],
      ['c', 'd'],
    ]

    const result = await runScripts(scripts)

    expect(result).toBe(0)
    expect(runScript).toHaveBeenCalledTimes(4)
    expect(runScript).toHaveBeenNthCalledWith(1, 'a')
    expect(runScript).toHaveBeenNthCalledWith(2, 'b')
    expect(runScript).toHaveBeenNthCalledWith(3, 'c')
    expect(runScript).toHaveBeenNthCalledWith(4, 'd')
  })

  it('exits early if a script in a group fails', async () => {
    mockRunScript
      .mockImplementationOnce(() => Promise.resolve(0)) // a
      .mockImplementationOnce(() => Promise.resolve(1)) // b
      .mockImplementation(() => Promise.resolve(0)) // c, d, e

    const scripts = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ]

    const result = await runScripts(scripts)

    expect(result).not.toBe(0)
    expect(runScript).toHaveBeenCalledTimes(3)
    expect(runScript).toHaveBeenNthCalledWith(1, 'a')
    expect(runScript).toHaveBeenNthCalledWith(2, 'b')
    expect(runScript).toHaveBeenNthCalledWith(3, 'c')
  })
})
