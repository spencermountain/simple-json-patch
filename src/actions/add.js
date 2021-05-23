const get = require('../get')
const getParent = require('../getParent')
const { isArray, isNumber, isObject, isString } = require('../_helper')

const add = (patch, json) => {
  let node = get(patch.path, json)
  // sneaky-push
  if (isArray(node) === true) {
    node.push(patch.value)
    return
  }
  // sneaky-splat
  if (isObject(node) === true && isObject(patch.value) === true) {
    Object.assign(node, patch.value)
    return
  }
  // traditional array-add
  let res = getParent(patch.path, json)
  if (isArray(res.parent)) {
    if (res.prop === '-') {
      res.parent.push(patch.value) //simple push
    } else if (isNumber(res.prop)) {
      res.parent.splice(res.prop, 0, patch.value) // splice into index
    }
  }
  // traditional object-add
  if (isObject(res.parent) && isString(res.prop)) {
    res.parent[res.prop] = patch.value // add it to object
  }
}

module.exports = add
