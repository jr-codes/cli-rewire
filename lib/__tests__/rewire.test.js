'use strict'

const rewire = require('../rewire')
const run = require('../run')

jest.mock('../run')

const ARGV = process.argv

beforeEach(() => {
  process.argv = ARGV
  process.exitCode = 0
})

afterAll(() => {
  process.argv = ARGV
  process.exitCode = 0
})

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

function setup({ value, args }) {
  run.mockResolvedValue(mockExecaResult({ exitCode: value }))
  process.argv = ['', '', ...args]
}

test('command', async () => {
  setup({ value: 5, args: [] })

  const rewired = rewire('nodemon')
  await rewired()

  expect(run).toHaveBeenCalledWith('nodemon', [], expect.any(Object))
  expect(process.exitCode).toBe(5)
})

test('command + argOptions', async () => {
  setup({ value: 0, args: ['-f', 'stylish'] })
  const argOptions = {
    alias: {
      config: 'c',
      format: 'f',
    },
    default: {
      config: 'path/to/my/config',
      format: 'pretty',
    },
  }

  const rewired = rewire('eslint', argOptions)
  await rewired()

  expect(run).toHaveBeenCalledWith(
    'eslint',
    expect.arrayContaining([
      '--config',
      'path/to/my/config',
      '--format',
      'stylish',
    ]),
    expect.any(Object)
  )
  expect(process.exitCode).toBe(0)
})

test('command + execOptions', async () => {
  setup({ value: 2, args: ['--silent'] })
  const execOptions = {
    buffer: true,
    cleanup: false,
  }

  const rewired = rewire('jest')
  await rewired(execOptions)

  expect(run).toHaveBeenCalledWith(
    'jest',
    ['--silent'],
    expect.objectContaining(execOptions)
  )
  expect(process.exitCode).toBe(2)
})

test('command + argOptions + execOptions', async () => {
  setup({ value: 1, args: ['--no-cache'] })
  const argOptions = {
    default: {
      cache: true,
      noEslintrc: true,
    },
  }

  const execOptions = {
    preferLocal: true,
  }

  const rewired = rewire('eslint', argOptions)
  await rewired(execOptions)

  expect(run).toHaveBeenCalledWith(
    'eslint',
    expect.arrayContaining(['--no-cache', '--no-eslintrc']),
    expect.objectContaining(execOptions)
  )
  expect(process.exitCode).toBe(1)
})

test('does not throw', async () => {
  run.mockRejectedValue(new Error('error'))

  const rewired = rewire('nodemon')

  await expect(rewired()).resolves.not.toThrow()
  expect(process.exitCode).toBe(1)
})
