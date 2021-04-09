'use strict'

const run = require('../run')

const exec = async (cmd, args, options) => {
  const { all } = await run(cmd, args, {
    all: true,
    buffer: true,
    stdio: 'pipe',
    ...options,
  })
  return all
}

test('node -v', async () => {
  const result = await exec('node', ['-v'])
  expect(result).toEqual(expect.stringMatching('v[0-9.]+'))
})

test('overrides env values', async () => {
  process.env.TEST123 = 'TEST123'
  const result = await exec('printenv', ['TEST123'], {
    env: {
      TEST123: 'TEST456',
    },
  })
  expect(result).toBe('TEST456')
})

test('preserves env precedence with process.env', async () => {
  process.env.TEST123 = 'TEST123'
  const result = await exec('printenv', ['TEST123'], {
    env: {
      TEST123: 'TEST456',
      ...process.env,
    },
    extendEnv: false,
  })
  expect(result).toBe('TEST123')
})
