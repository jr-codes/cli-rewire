'use strict'

/**
 * Splits a string into an array based on spaces and quotations.
 *
 * @param {string} string String to tokenize
 * @returns {string[]} array of strings
 *
 * @example
 * tokenize('eslint --ext .jsx --ext .js lib/')
 * // Returns ['eslint', '--ext', '.jsx', '--ext', '.js', 'lib/']
 *
 * @example
 * tokenize('git commit -m "remove unused dependencies"')
 * // Returns ['git', 'commit', '-m', 'remove unused dependencies']
 */
function tokenize(string) {
  if (typeof string !== 'string') {
    throw new TypeError(`Expected string, got ${typeof string}`)
  }

  const tokens = []
  let index = 0
  let quote = ''

  for (const character of string) {
    // Add character to token
    // if inside quotes and character's not a close quote OR
    // if outside quotes and character's not a space or open quote
    if (
      (quote && character !== quote) ||
      (!quote && character !== ' ' && character !== "'" && character !== '"')
    ) {
      // Initialize token if empty
      if (!tokens[index]) tokens[index] = ''
      tokens[index] += character
    }

    // Move to next token if token's not empty AND
    // closing quotes OR outside quotes and character's a space
    if (
      tokens[index] &&
      ((quote && character === quote) || (!quote && character === ' '))
    ) {
      index += 1
    }

    // Close quote if character equals quote
    // Open quote if character is a quote
    if (quote && character === quote) {
      quote = ''
    } else if (!quote && (character === '"' || character === "'")) {
      quote = character
    }
  }

  return tokens
}

module.exports = tokenize
