/* @flow */
import R from 'ramda'

/**
 * equal - Devuelve true si word1 o word1.v es idéntico a word2 o word2.v
 *
 * @param {string|object} word1 Primer valor para comprobar igualdad
 * @param {string|object} word2 Segundo valor a comprobar igualdad
 *
 * @returns {boolean} 
 */
const equal = (
  word1: string | { s: number, e: number, v: string },
  word2: string | { s: number, e: number, v: string }
): boolean => {
  return R.is(String, word1)
    ? R.is(String, word2) ? word1 === word2 : word1 === word2.v
    : R.is(String, word2)
      ? word1.v === word2
      : word1.v === word2.v
}

export default equal
