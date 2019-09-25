import '@babel/polyfill'
import match from './checkers/match.js'
import required from './checkers/required.js'

export class ValidationError extends Error {
  constructor (errors) {
    const s = [
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
  for (const k in o) {
    if (Object.prototype.hasOwnProperty.call(o, k)) {
      if (typeof o[k] === 'object' && isEmpty(o[k])) {
        continue
      }
      return false
    }
  }
  return true
}

export const validateObj = function validateObj (rules, obj) {
  if (obj === undefined) {
    return function (obj) {
      return _validateObj(rules, obj)
    }
  }
  return _validateObj(rules, obj)
}

const _validateObj = async function (rules, obj) {
  const errors = {}
  await _iter(rules, obj, errors, obj)
  if (isEmpty(errors)) {
    return
  }
  const e = new ValidationError(errors)
  throw e
}

const _iter = async function _iter (rules, obj, errors, root) {
  for (const k in rules) {
    if (typeof rules[k] === 'function') {
      try {
        await rules[k].apply(obj, [obj[k], root])
      } catch (e) {
        errors[k] = e.message
      }
    } else if (Array.isArray(rules[k])) {
      for (const rule of rules[k]) {
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
