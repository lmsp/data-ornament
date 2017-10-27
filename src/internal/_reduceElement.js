/* @flow */
import R from 'ramda'
import _appendElement from './_appendElement'

const _reduceElement = (
  acc: Array<{ s: number, e: number, v: string }>,
  item: string
): Array<{ s: number, e: number, v: string }> =>
  R.length(acc) === 0
    ? R.append({ v: item, s: 0, e: item.length }, acc)
    : _appendElement(acc, item)

export default _reduceElement
