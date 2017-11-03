/* @flow */
import R from 'ramda'

import _mergeOptions from './internal/_mergeOptions'

import equal from './equal'
import excludeIntersections from './excludeIntersections'
import select from './select'

const returnWordInArray = word => {
  return doc => [word]
}
const selectBetweenUncurried = (
  word1: string | { s: number, e: number, v: string },
  word2: string | { s: number, e: number, v: string },
  exclusions: Array<{ s: number, e: number, v: string }>,
  options: Object,
  doc: string | Array<{ s: number, e: number, v: string }>
): Array<{ s: number, e: number, v: string }> => {
  let internalOptions = _mergeOptions(
    {
      excludeFirst: false,
      excludeLast: false,
      excludeBoth: false,
      isolatedFirst: [false, false, false],
      isolatedLast: [false, false, false],
      trimLeft: false,
      trimRight: false,
      trimBoth: false
    },
    options
  )
  const unionLists = () => {
    let internalOptionsFirst = {
      isolatedLeft: internalOptions.isolatedFirst[0],
      isolatedRight: internalOptions.isolatedFirst[1],
      isolatedBoth: internalOptions.isolatedFirst[2]
    }
    let internalOptionsLast = {
      isolatedLeft: internalOptions.isolatedLast[0],
      isolatedRight: internalOptions.isolatedLast[1],
      isolatedBoth: internalOptions.isolatedLast[2]
    }
    return R.union(
      R.pipe(
        R.is(String, word1)
          ? select(word1, internalOptionsFirst)
          : returnWordInArray(word1),
        excludeIntersections(R.__, exclusions)
      )(doc),
      R.pipe(
        R.is(String, word2)
          ? select(word2, internalOptionsLast)
          : returnWordInArray(word2),
        excludeIntersections(R.__, exclusions)
      )(doc)
    )
  }
  const sortByStart = function (a, b) {
    return a.s > b.s
  }
  const rejectElement = (val, idx, list) => {
    if (idx === 0) {
      if (equal(val, word1)) {
        list[idx].t = 1
        return false
      } else {
        list[idx].t = 2
        return true
      }
    } else {
      let lastType = list[idx - 1].t
      if (lastType === 1) {
        if (equal(val, word2)) {
          list[idx].t = 2
          return false
        } else {
          list[idx].t = 1
          return true
        }
      } else {
        if (equal(val, word1)) {
          list[idx].t = 1
          return false
        } else {
          list[idx].t = 2
          return true
        }
      }
    }
  }
  const appendInterval = (acc, item) => {
    let start = R.last(acc).s
    let end = item.e
    if (internalOptions.excludeFirst || internalOptions.excludeBoth) {
      start = R.last(acc).e
    }
    if (internalOptions.excludeLast || internalOptions.excludeBoth) end = item.s
    let value = doc.substring(start, end)
    if (internalOptions.trimLeft || internalOptions.trimBoth) {
      let length = R.length(value)
      value = value.trimLeft()
      start = start + (length - R.length(value))
    }
    if (internalOptions.trimRight || internalOptions.trimBoth) {
      value = value.trimRight()
      end = start + R.length(value)
    }
    return R.append({ s: start, e: end, v: value }, acc)
  }
  const reduceInterval = (acc, item) =>
    R.length(acc) % 2 === 0 ? R.append(item, acc) : appendInterval(acc, item)
  return R.pipe(
    unionLists,
    R.sort(sortByStart),
    R.addIndex(R.reject)(rejectElement),
    R.reduce(reduceInterval, []),
    R.addIndex(R.reject)((val, idx) => idx % 2 === 0)
  )()
}
/**
 * selectBetween -  Obtiene todas las apariciones de textos entre word1 y word2
 *                  dentro de doc excepto las que contienen la lista de exclusiones
 *
 * @param {string|Object} word1   Primera palabra a buscar
 * @param {string|Object} word2   Segunda palabra a buscar
 * @param {Array} exclusions Textos a excluir
 * @param {Object} options  Opciones:<br/>
 *                          **excludeFirst**: Si vale true se incluye word1 en
 *                          la búsqueda. Valor por defecto false.<br/>
 *                          **excludeLast**: Si vale true se incluye word2 en
 *                          la búsqueda. Valor por defecto false.<br/>
 *                          **excludeBoth**: Si vale true se incluiran word1 y
 *                          word2 en la búsqueda. Valor por defecto false.<br/>
 *                          **isolatedFirst**: Forma de seleccionar word1. Mirar
 *                          select. Valores por defecto [false, false, false]<br/>
 *                          **isolatedLast**: Forma de seleccionar word1. Mirar
 *                          select. Valores por defecto [false, false, false]<br/>
 *                          **trimLeft** Si vale true aplica la eliminación de
 *                          blancos por la izquierda. Valor por defecto false.<br/>
 *                          **trimRight** Si vale true aplica la eliminación de
 *                          blancos por la derecha. Valor por defecto false.<br/>
 *                          **trimBoth** Si vale true aplica la eliminación de
 *                          blancos por la derecha y por la izquierda. Valor por
 *                          defecto false.<br/>
 * @param {string|Array} doc  Documento en el que buscar
 *
 * @returns {Array} Devuelve el documento que contiene los textos entre word1 y
 *                  word2 excepto los contenidos en exclusions
 */
const selectBetween = R.curry(selectBetweenUncurried)

export default selectBetween
