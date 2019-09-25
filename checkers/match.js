export default function match (pattern, msg) {
  return function (v) {
    if (!pattern.test(v)) {
      throw new Error(msg || 'dose not match pattern ' + pattern)
    }
  }
}
