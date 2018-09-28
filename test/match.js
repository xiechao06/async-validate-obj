require('should')
const match = require('../checker/match')

describe('match', function () {
  it('pass', function () {
    match(/abc/, 'should be abc')('abc')
  })
  it('throw error', function () {
    ;(function () {
      match(/xyz/, 'should be xyz')('abc')
    }).should.throw(Error, {
      message: 'should be xyz'
    })
  })
})
