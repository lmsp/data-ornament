/* @flow */

const _mergeOptions = (defaultOptions: {}, options: {}) => {
  let keys = Object.keys(defaultOptions)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    if (options[key]) defaultOptions[key] = options[key]
  }
  return defaultOptions
}

export default _mergeOptions
