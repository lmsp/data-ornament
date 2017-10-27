/* @flow */
import R from 'ramda'

const _appendElement = (
  acc: Array<{ s: number, e: number, v: string }>,
  item: string
): Array<{ s: number, e: number, v: string }> => {
  let start = acc[acc.length-1].e
  return R.append({ v: item, s: start, e: start + item.length }, acc)
}

export default _appendElement
