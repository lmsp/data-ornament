import R from 'ramda'
import select from '../src/select'
import selectBetween from '../src/selectBetween'

test('selectBetween word in string', () => {
  let wordToExclude = 'Aab'
  let doc =
    'abcclass ld{jLDJ{JDñ class {L p }S D}Aab} }cDD ab DDdDabCDD  ab Aab DD'
  let word1 = 'ab'
  let word2 = 'DD'
  let result = R.pipe(
    select(wordToExclude, {}),
    selectBetween(word1, word2, R.__, {}, doc)
  )(doc)
  expect(result).toMatchObject([
    {
      e: 46,
      s: 0,
      v: 'abcclass ld{jLDJ{JDñ class {L p }S D}Aab} }cDD'
    },
    {
      e: 52,
      s: 47,
      v: 'ab DD'
    },
    {
      e: 59,
      s: 54,
      v: 'abCDD'
    },
    {
      e: 70,
      s: 61,
      v: 'ab Aab DD'
    }
  ])
})

test('selectBetween paragraphs in HTML(words in json)', () => {
  let doc = '<p>En un lugar de la Mancha...</p>'
  let result = select('</p>', {}, doc)
  expect(result).toMatchObject([
    {
      s: 30,
      e: 34,
      v: '</p>'
    }
  ])
  result = select('<p>', {}, doc)
  expect(result).toMatchObject([
    {
      s: 0,
      e: 3,
      v: '<p>'
    }
  ])
  let word1 = { s: 0, e: 3, v: '<p>' }
  let word2 = { s: 30, e: 34, v: '</p>' }
  result = selectBetween(word1, word2, [], {}, doc)
  expect(result).toMatchObject([
    {
      s: 0,
      e: 34,
      v: '<p>En un lugar de la Mancha...</p>'
    }
  ])
})

test('selectBetween paragraphs in HTML(words in json)', () => {
  let doc =
    '<p>En un lugar de la Mancha...</p><p>de cuyo nombre no quiero acordarme</p>'
  let word1 = '<p>'
  let word2 = '</p>'
  let result = selectBetween(word1, word2, [], {}, doc)
  expect(result).toMatchObject([
    {
      s: 0,
      e: 34,
      v: '<p>En un lugar de la Mancha...</p>'
    },
    {
      s: 34,
      e: 75,
      v: '<p>de cuyo nombre no quiero acordarme</p>'
    }
  ])
})

test('selectBetween paragraphs in HTML', () => {
  let doc = '<p>En un lugar de la Mancha...</p>'
  let word1 = '<p>'
  let word2 = '</p>'
  let result = selectBetween(word1, word2, [], {}, doc)
  expect(result).toMatchObject([
    {
      s: 0,
      e: 34,
      v: '<p>En un lugar de la Mancha...</p>'
    }
  ])
  result = selectBetween(word1, word2, [], { excludeFirst: true }, doc)
  expect(result).toMatchObject([
    {
      s: 3,
      e: 34,
      v: 'En un lugar de la Mancha...</p>'
    }
  ])
  result = selectBetween(word1, word2, [], { excludeLast: true }, doc)
  expect(result).toMatchObject([
    {
      s: 0,
      e: 30,
      v: '<p>En un lugar de la Mancha...'
    }
  ])
  result = selectBetween(word1, word2, [], { excludeBoth: true }, doc)
  expect(result).toMatchObject([
    {
      s: 3,
      e: 30,
      v: 'En un lugar de la Mancha...'
    }
  ])
  doc = '<p> En un lugar de la Mancha... </p>'
  result = selectBetween(
    word1,
    word2,
    [],
    { excludeBoth: true, trimLeft: true },
    doc
  )
  expect(result).toMatchObject([
    {
      s: 4,
      e: 32,
      v: 'En un lugar de la Mancha... '
    }
  ])
  result = selectBetween(
    word1,
    word2,
    [],
    { excludeBoth: true, trimRight: true },
    doc
  )
  expect(result).toMatchObject([
    {
      s: 3,
      e: 31,
      v: ' En un lugar de la Mancha...'
    }
  ])
  result = selectBetween(
    word1,
    word2,
    [],
    { excludeBoth: true, trimBoth: true },
    doc
  )
  expect(result).toMatchObject([
    {
      s: 4,
      e: 31,
      v: 'En un lugar de la Mancha...'
    }
  ])
})

test('selectBetween paragraphs in HTML(2)', () => {
  let doc = '<p>En un lugar de la Mancha...</p>'
  let word1 = '<p>'
  let word2 = '</p>'
  let result = selectBetween(
    word1,
    word2,
    [],
    { isolatedFirst: [false, false, true] },
    doc
  )
  expect(result).toMatchObject([])
  doc = '<p> En un lugar de la Mancha...</p>'
  result = selectBetween(
    word1,
    word2,
    [],
    { isolatedFirst: [false, false, true] },
    doc
  )
  expect(result).toMatchObject([
    {
      e: 35,
      s: 0,
      v: '<p> En un lugar de la Mancha...</p>'
    }
  ])
  doc = '<p>En un lugar de la Mancha...</p>'
  result = selectBetween(
    word1,
    word2,
    [],
    { isolatedLast: [false, false, true] },
    doc
  )
  expect(result).toMatchObject([])
  doc = '<p>En un lugar de la Mancha... </p>'
  result = selectBetween(
    word1,
    word2,
    [],
    { isolatedLast: [false, false, true] },
    doc
  )
  expect(result).toMatchObject([
    {
      e: 35,
      s: 0,
      v: '<p>En un lugar de la Mancha... </p>'
    }
  ])
})
