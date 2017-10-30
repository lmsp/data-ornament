import R from 'ramda'
import select from '../src/select'
import selectBetween from '../src/selectBetween'

test('select word in string', () => {
  let wordToExclude = 'Aab'
  let doc =
    'abcclass ld{jLDJ{JDñ class {L p }S D}Aab} }cDD ab DDdDabCDD  ab Aab DD'
  let word1 = 'ab'
  let word2 = 'DD'
  let result = R.pipe(
    select(wordToExclude, {}),
    selectBetween(word1, word2, R.__, {}, doc)
  )(doc)
  expect(result).toMatchObject([])
})
