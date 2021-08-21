'use strict'

const tokenize = require('../tokenize')

test.each([
  ['eslint --fix .', ['eslint', '--fix', '.']],
  ['eslint    --fix   .   ', ['eslint', '--fix', '.']],
  ['  nodemon  --help', ['nodemon', '--help']],
  [
    'eslint --ext .jsx --ext .js lib/',
    ['eslint', '--ext', '.jsx', '--ext', '.js', 'lib/'],
  ],
  [
    'git commit -m "remove unused dependencies"',
    ['git', 'commit', '-m', 'remove unused dependencies'],
  ],
  [
    "git commit -m 'remove unused dependencies'",
    ['git', 'commit', '-m', 'remove unused dependencies'],
  ],
  ['echo "1 2 3" "4 5 6" 7 8 9', ['echo', '1 2 3', '4 5 6', '7', '8', '9']],
  [
    'lerna version -m "chore(release): publish" --force-publish',
    ['lerna', 'version', '-m', 'chore(release): publish', '--force-publish'],
  ],
  [
    "lerna version -m 'chore(release): publish' --force-publish",
    ['lerna', 'version', '-m', 'chore(release): publish', '--force-publish'],
  ],
  ['', []],
])('parses %p', (input, expected) => {
  const result = tokenize(input)
  expect(result).toEqual(expected)
})

test.each([
  [null],
  [undefined],
  [3],
  [[1, 2, 3]],
  [{ foo: 'bar' }],
  [['array', 'of', 'strings']],
])('throws on %p', (input) => {
  expect(() => {
    tokenize(input)
  }).toThrow()
})
