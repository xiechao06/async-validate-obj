export default function required (str) {
  return function (v) {
    if (v === null || v === '' || v === void 0 || (Array.isArray(v) && !v.length)) {
      throw new Error(str || 'should not be empty')
    }
  }
}
