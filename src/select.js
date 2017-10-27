/* @flow */
import R from 'ramda'
import _mergeOptions from './internal/_mergeOptions'
import _reduceElement from './internal/_reduceElement'

const selectUncurried = (
  word: string,
  options: {},
  doc: string | Array<{ s: number, e: number, v: string }>
): Array<{ s: number, e: number, v: string }> => {
  if (R.is(String, doc)) {
    let internalOptions = _mergeOptions(
      {
        isolatedLeft: false,
        isolatedRight: false,
        isolatedBoth: false
      },
      options
    )
    const innerJoinElement = (
      record: { s: number, e: number, v: string },
      v: string
    ): boolean => {
      if (record.v === v) {
        if (internalOptions.isolatedLeft || internalOptions.isolatedBoth) {
          if (record.s === 0) return true
          if (R.any(R.equals(doc[record.s - 1]), [' ', '\n', '\r'])) return true
          return false
        }
        if (internalOptions.isolatedRight || internalOptions.isolatedBoth) {
          if (record.e === doc.length) return true
          if (R.any(R.equals(doc[record.e]), [' ', '\n', '\r'])) return true
          return false
        }
        return true
      }
      return false
    }
    return R.pipe(
      R.split,
      R.intersperse(word),
      R.reduce(_reduceElement, []),
      // $FlowFixMe
      R.innerJoin(innerJoinElement, R.__, [word])
    )(word, doc)
  } else {
    const reduceElement = (
      acc: Array<{ s: number, e: number, v: string }>,
      item: { s: number, e: number, v: string }
    ): Array<{ s: number, e: number, v: string }> => {
      const mapElement = (elem: {
        s: number,
        e: number,
        v: string
      }): { s: number, e: number, v: string } => {
        let start = item.s + elem.s
        return { v: word, s: start, e: start + word.length }
      }
      return R.union(acc, R.map(mapElement, select(word, options, item.v)))
    }
    return R.reduce(reduceElement, [], doc)
  }
}
const select = R.curry(selectUncurried)

export default select
