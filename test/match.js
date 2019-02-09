require('should')
const { checkers } = require('../index')

describe('match', function () {
  it('pass', function () {
    checkers.match(/abc/, 'should be abc')('abc')
  })
  it('throw error', function () {
    ;(function () {
      checkers.match(/xyz/, 'should be xyz')('abc')
    }).should.throw(Error, {
      message: 'should be xyz'
    })
  })
})
