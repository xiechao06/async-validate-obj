require('should')
const required = require('../checker/required')

describe('required', function () {
  it('pass', function () {
    required()('abc')
  })

  it('throw', function () {
    ;(function () {
      required('should not be empty')()
    }).should.throw(Error, { message: 'should not be empty' })
    ;(function () {
      required('should not be empty')('')
    }).should.throw(Error, { message: 'should not be empty' })
    ;(function () {
      required('should not be empty')(null)
    }).should.throw(Error, { message: 'should not be empty' })
    ;(function () {
      required('should not be empty')([])
    }).should.throw(Error, { message: 'should not be empty' })
  })
})
