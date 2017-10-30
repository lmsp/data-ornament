/* @flow */
import R from 'ramda'

const excludeIntersectionsUncurried = (
  doc1: Array<{ s: number, e: number, v: string }>,
  doc2: Array<{ s: number, e: number, v: string }>
): Array<{ s: number, e: number, v: string }> => {
  if (R.length(doc1) === 0) return []
  if (R.length(doc2) === 0) return doc1
  const cmpIntersection = (x, y) => x.s >= y.s && x.s < y.e
  return R.differenceWith(cmpIntersection, doc1, doc2)
}

/**
 * excludeIntersections - Devuelve una lista de elementos que pertenecen a doc1
 *                        y que no intersectan con ningún elemento de doc2.
 *                        La forma de mirar la intersección es peculiar y
 *                        consiste en comprobar que el inicio del elemento de doc1
 *                        no cae entre el inicio(incluido) y el final(no incluido)
 *                        de los elementos de doc2. 
 *
 * @param {Array} doc1 Lista de elementos de los que se obtiene el resultado
 * @param {Array} doc2 Lista de elementos con los que se comprueba la intersección
 *
 * @returns {Array} Lista de elementos de doc1 que no intersectan con doc2
 */
const excludeIntersections = R.curry(excludeIntersectionsUncurried)

export default excludeIntersections
