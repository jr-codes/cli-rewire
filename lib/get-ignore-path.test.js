'use strict'

const getIgnorePath = require('./get-ignore-path')
const findConfig = require('./find-config')

jest.mock('./find-config')

/** @type {Object} */
const mockFindConfig = findConfig

describe('get-ignore-path', () => {
  it('returns an ignore path', () => {
    mockFindConfig.mockImplementation(() => ({
      filepath: 'my/file/.gitignore',
    }))

    const result = getIgnorePath('.gitignore')

    expect(result).toBe('my/file/.gitignore')
  })

  it('returns null if no ignore path is found', () => {
    mockFindConfig.mockImplementation(() => null)

    const result = getIgnorePath('.prettierignore')

    expect(result).toBeNull()
  })

  it('passes valid loaders to config', () => {
    mockFindConfig.mockImplementation((name, ignoreOptions) => {
      ignoreOptions.loaders.noExt()
    })

    expect(() => {
      getIgnorePath('.prettierignore')
    }).not.toThrow()
  })
})
