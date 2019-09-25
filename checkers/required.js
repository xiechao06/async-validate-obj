export default function required (str) {
  return function (v) {
    if (v === null || v === '' || v === undefined || (Array.isArray(v) && !v.length)) {
      throw new Error(str || 'should not be empty')
    }
  }
}
