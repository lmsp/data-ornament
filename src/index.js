/* @flow */
/**
 * Un objeto Index
 */
export default class Index {
  constructor () {
    this._name = 'MyIndex'
  }
  /**
   * Devuelve un nombre
   * @returns {String} el nombre actual
   */
  get name () {
    return this._name
  }
}
