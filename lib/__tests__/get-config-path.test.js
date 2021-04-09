'use strict'

const getConfigPath = require('../get-config-path')
const findConfig = require('../find-config')

jest.mock('../find-config')

/** @type {Object} */
const mockFindConfig = findConfig

describe('get-config-path', () => {
  it('returns a config path', () => {
    mockFindConfig.mockImplementation(() => ({
      filepath: 'my/file/path.txt',
    }))

    const result = getConfigPath('babel')

    expect(result).toBe('my/file/path.txt')
  })

  it('returns null if no config is found', () => {
    mockFindConfig.mockImplementation(() => null)

    const result = getConfigPath('webpack')

    expect(result).toBeNull()
  })
})
