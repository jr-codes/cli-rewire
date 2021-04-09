'use strict'

const getConfig = require('../get-config')
const findConfig = require('../find-config')

jest.mock('../find-config')

/** @type {Object} */
const mockFindConfig = findConfig

describe('get-config', () => {
  it('returns a config', () => {
    const mockConfig = { test: true }
    mockFindConfig.mockImplementation(() => ({
      config: mockConfig,
    }))

    const result = getConfig('prettier')

    expect(result).toEqual(mockConfig)
  })

  it('returns null if no config is found', () => {
    mockFindConfig.mockImplementation(() => null)

    const result = getConfig('prettier')

    expect(result).toBeNull()
  })
})
