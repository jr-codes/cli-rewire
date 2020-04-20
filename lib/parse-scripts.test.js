'use strict'

const parseScripts = require('./parse-scripts')

const scriptMap = {
  a: 'path/to/a',
  b: 'path/to/b',
  c: 'path/to/c',
  d: 'path/to/d',
  e: 'path/to/e',
}

const test1 = {
  input: ['a', 'b', 'c'],
  output: [
    [{ name: 'a', path: scriptMap.a, args: [], options: {} }],
    [{ name: 'b', path: scriptMap.b, args: [], options: {} }],
    [{ name: 'c', path: scriptMap.c, args: [], options: {} }],
  ],
}

const test2 = {
  input: [['a', { runWithNext: true }], 'b', ['c', { runWithNext: true }], 'd'],
  output: [
    [
      {
        name: 'a',
        path: scriptMap.a,
        args: [],
        options: { runWithNext: true },
      },
      { name: 'b', path: scriptMap.b, args: [], options: {} },
    ],
    [
      {
        name: 'c',
        path: scriptMap.c,
        args: [],
        options: { runWithNext: true },
      },
      { name: 'd', path: scriptMap.d, args: [], options: {} },
    ],
  ],
}

const test3 = {
  input: ['a'],
  output: [[{ name: 'a', path: scriptMap.a, args: [], options: {} }]],
}

const test4 = {
  input: [['a', { runWithNext: true }]],
  output: [
    [
      {
        name: 'a',
        path: scriptMap.a,
        args: [],
        options: { runWithNext: true },
      },
    ],
  ],
}

const test5 = {
  input: ['a', ['b', { runWithNext: true }]],
  output: [
    [{ name: 'a', path: scriptMap.a, args: [], options: {} }],
    [
      {
        name: 'b',
        path: scriptMap.b,
        args: [],
        options: { runWithNext: true },
      },
    ],
  ],
}

const test6 = {
  input: [
    ['a', { runWithNext: true }],
    ['b', { runWithNext: true }],
    ['c', { runWithNext: true }],
    ['d'],
  ],
  output: [
    [
      {
        name: 'a',
        path: scriptMap.a,
        args: [],
        options: { runWithNext: true },
      },
      {
        name: 'b',
        path: scriptMap.b,
        args: [],
        options: { runWithNext: true },
      },
      {
        name: 'c',
        path: scriptMap.c,
        args: [],
        options: { runWithNext: true },
      },
      {
        name: 'd',
        path: scriptMap.d,
        args: [],
        options: {},
      },
    ],
  ],
}

describe('parse-scripts', () => {
  it.each([
    [test1.input, test1.output],
    [test2.input, test2.output],
    [test3.input, test3.output],
    [test4.input, test4.output],
    [test5.input, test5.output],
    [test6.input, test6.output],
  ])('parses %j', (rawScripts, expected) => {
    const result = parseScripts(rawScripts, scriptMap)
    expect(result).toEqual(expected)
  })
})
