import equal from '../src/equal'

test('test function equal', () => {
  expect(equal('patata', 'patata')).toBe(true)
  expect(equal({ s: 0, e: 6, v: 'patata' }, 'patata')).toBe(true)
  expect(equal('patata', { s: 0, e: 6, v: 'patata' })).toBe(true)
  expect(equal({ s: 0, e: 6, v: 'patata' }, { s: 1, e: 7, v: 'patata' })).toBe(true)
})
