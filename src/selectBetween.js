/* @flow */
import R from 'ramda'

import _mergeOptions from './internal/_mergeOptions'

import equal from './equal'
import excludeIntersections from './excludeIntersections'
import select from './select'

const caller = list => {
  return doc => list
}
const selectBetweenUncurried = (word1, word2, exclusions, options, doc) => {
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
          : caller(word1),
        excludeIntersections(R.__, exclusions)
      )(doc),
      R.pipe(
        R.is(String, word2)
          ? select(word2, internalOptionsLast)
          : caller(word2),
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
        list[idx].t = 0
        return true
      }
    } else {
      let lastType = list[idx - 1].t
      if (lastType === 0) {
        if (equal(val, word1)) {
          list[idx].t = 1
          return false
        } else {
          list[idx].t = 0
          return true
        }
      } else {
        if (lastType === 1) {
          if (equal(val, word2)) {
            list[idx].t = 2
            return false
          } else {
            list[idx].t = 0
            return true
          }
        } else {
          if (equal(val, word1)) {
            list[idx].t = 1
            return false
          } else {
            list[idx].t = 0
            return true
          }
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
const selectBetween = R.curry(selectBetweenUncurried)

export default selectBetween
