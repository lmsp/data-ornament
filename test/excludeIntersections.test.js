import excludeIntersections from '../src/excludeIntersections'

test('remove intersections', () => {
  let doc1 = [
    {
      s: 0,
      e: 6,
      v: 'patata'
    },
    {
      s: 10,
      e: 17,
      v: 'boniato'
    }
  ]
  let doc2 = [
    {
      s: 5,
      e: 10,
      v: 'frita'
    },
    {
      s: 11,
      e: 18,
      v: 'boniato'
    }
  ]
  expect(excludeIntersections(doc1, doc2)).toMatchObject([
    {
      s: 0,
      e: 6,
      v: 'patata'
    },
    {
      s: 10,
      e: 17,
      v: 'boniato'
    }
  ])
})

test('remove intersections(2)', () => {
  let doc1 = [
    {
      s: 0,
      e: 6,
      v: 'patata'
    }
  ]
  let doc2 = [
    {
      s: 7,
      e: 13,
      v: 'frita'
    }
  ]
  expect(excludeIntersections(doc1, doc2)).toMatchObject([
    {
      s: 0,
      e: 6,
      v: 'patata'
    }
  ])
})

test('remove intersections(3)', () => {
  let doc1 = [
    {
      s: 3,
      e: 9,
      v: 'patata'
    }
  ]
  let doc2 = [
    {
      s: 2,
      e: 7,
      v: 'frita'
    }
  ]
  expect(excludeIntersections(doc1, doc2)).toMatchObject([])
})
