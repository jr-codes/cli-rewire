'use strict'

beforeEach(() => {
  jest.resetModules()
})

describe('find-config', () => {
  it('returns search result when config is found', () => {
    jest.mock('cosmiconfig')

    const expectedResult = { config: {}, filepath: '' }
    const search = jest.fn(() => expectedResult)
    const cosmiconfig = require('cosmiconfig')
    cosmiconfig.cosmiconfigSync.mockReturnValue({ search })

    const findConfig = require('./find-config')
    const result = findConfig('babel')

    expect(cosmiconfig.cosmiconfigSync).toHaveBeenCalledWith('babel', {})
    expect(search).toHaveBeenCalled()
    expect(result).toEqual(expectedResult)
  })

  it('returns nothing if no config and no default config', () => {
    jest.mock('cosmiconfig')

    const expectedResult = null
    const search = jest.fn(() => expectedResult)
    const cosmiconfig = require('cosmiconfig')
    cosmiconfig.cosmiconfigSync.mockReturnValue({ search })

    const findConfig = require('./find-config')
    const result = findConfig('eslint')

    expect(cosmiconfig.cosmiconfigSync).toHaveBeenCalledWith('eslint', {})
    expect(search).toHaveBeenCalled()
    expect(result).toEqual(expectedResult)
  })

  it('returns default config if no config is found', () => {
    jest.mock('cosmiconfig')

    const expectedResult = { config: {}, filepath: '' }
    const load = jest.fn(() => expectedResult)
    const search = jest.fn(() => null)
    const cosmiconfig = require('cosmiconfig')
    cosmiconfig.cosmiconfigSync.mockReturnValue({ load, search })

    const findConfig = require('./find-config')
    const result = findConfig('jest', {}, 'path/to/jest.config.js')

    expect(cosmiconfig.cosmiconfigSync).toHaveBeenCalledWith('jest', {})
    expect(search).toHaveBeenCalled()
    expect(load).toHaveBeenCalledWith('path/to/jest.config.js')
    expect(result).toEqual(expectedResult)
  })
})
