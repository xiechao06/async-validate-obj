import '@babel/polyfill'
import match from './checkers/match.js'
import required from './checkers/required.js'

export class ValidationError extends Error {
  constructor (errors) {
    let s = [
      'Validation error: ',
      Object.entries(errors).map(
        ([k, v]) => '   * ' + k + '-' + v
      )
    ].join('\n')
    super(s)
    this.errors = errors
  }
}

const isEmpty = function isEmpty (o) {
  for (let k in o) {
    if (o.hasOwnProperty(k)) {
      if (typeof o[k] === 'object' && isEmpty(o[k])) {
        continue
      }
      return false
    }
  }
  return true
}

export const validateObj = function validateObj (rules, obj) {
  if (obj === void 0) {
    return function (obj) {
      return _validateObj(rules, obj)
    }
  }
  return _validateObj(rules, obj)
}

const _validateObj = async function (rules, obj) {
  let errors = {}
  await _iter(rules, obj, errors, obj)
  if (isEmpty(errors)) {
    return
  }
  let e = new ValidationError(errors)
  throw e
}

const _iter = async function _iter (rules, obj, errors, root) {
  for (let k in rules) {
    if (typeof rules[k] === 'function') {
      try {
        await rules[k].apply(obj, [obj[k], root])
      } catch (e) {
        errors[k] = e.message
      }
    } else if (Array.isArray(rules[k])) {
      for (let rule of rules[k]) {
        try {
          await rule.apply(obj, [obj[k], root])
        } catch (e) {
          errors[k] = e.message
          break
        }
      }
    } else {
      errors[k] = {}
      await _iter(rules[k], obj && obj[k], errors[k], root)
    }
  }
}

export const checkers = {
  match,
  required
}
