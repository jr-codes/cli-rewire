'use strict'

const runWithYargs = require('./run-with-yargs')
const run = require('./run')

jest.mock('./run')

/** @type {Object} */
const mockRun = run

const ARGV = process.argv

afterAll(() => {
  process.argv = ARGV
})

describe('run-with-yargs', () => {
  it('runs with args', async () => {
    mockRun.mockImplementation(() => Promise.resolve(0))
    process.argv = ['node', 'file.js', '--write', '.']
    const args = {
      alias: {
        config: 'c',
        format: 'f',
      },
      default: {
        cache: true,
      },
    }

    await expect(runWithYargs('prettier', args)).resolves.toBe(0)
    expect(mockRun).toHaveBeenCalledWith(
      'prettier',
      expect.arrayContaining(['--write', '.', '--cache']),
      {}
    )
  })

  it('runs with no args', async () => {
    mockRun.mockImplementation(() => Promise.resolve(0))
    process.argv = ['node', 'file.js', '--pass-with-no-tests', '--silent']

    await expect(runWithYargs('jest')).resolves.toBe(0)
    expect(mockRun).toHaveBeenCalledWith(
      'jest',
      expect.arrayContaining(['--pass-with-no-tests', '--silent']),
      {}
    )
  })
})
