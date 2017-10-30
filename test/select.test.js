import select from '../src/select'

test('select word in string', () => {
  let word = 'patata'
  let doc = 'patata frita'
  expect(select(word, { isolatedLeft: true }, doc)).toMatchObject([
    {
      s: 0,
      e: 6,
      v: 'patata'
    }
  ])
  let doc2 = 'peppatata frita'
  expect(select(word, { isolatedLeft: false }, doc2)).toMatchObject([
    {
      s: 3,
      e: 9,
      v: 'patata'
    }
  ])
  expect(select(word, { isolatedLeft: true }, doc2)).toMatchObject([])
})

test('select word in json', () => {
  let word = 'patata'
  let doc = [{ s: 2, e: 14, v: 'patata frita' }]
  expect(select(word, {}, doc)).toMatchObject([
    {
      s: 2,
      e: 8,
      v: 'patata'
    }
  ])
})

test('select word in json(2)', () => {
  let word = 'frita'
  let doc = [{ s: 2, e: 14, v: 'patata frita' }]
  expect(select(word, {}, doc)).toMatchObject([
    {
      s: 9,
      e: 14,
      v: 'frita'
    }
  ])
})
