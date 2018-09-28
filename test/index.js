const sinon = require('sinon')
require('should')
require('should-sinon')
const { validateObj, ValidationError } = require('../')

describe('validate obj', function () {
  it('simple', async function () {
    let aRule = sinon.spy()
    await validateObj({
      a: aRule
    })({ a: 1 })
    aRule.should.be.calledWithExactly(1, { a: 1 })
  })

  it('multiple rules', async function () {
    let aRule = sinon.spy()
    let bRule = sinon.spy()
    await validateObj({
      a: [aRule, bRule]
    })({ a: 1 })
    aRule.should.be.calledWithExactly(1, { a: 1 })
    bRule.should.be.calledWithExactly(1, { a: 1 })
  })

  it('nested', async function () {
    let aRule = sinon.spy()
    let bRule = sinon.spy()
    await validateObj({
      a: {
        b: [aRule, bRule]
      }
    })({ a: { b: 1 } })
    aRule.should.be.calledWithExactly(1, { a: { b: 1 } })
    bRule.should.be.calledWithExactly(1, { a: { b: 1 } })
  })

  it('throws', async function () {
    await validateObj({
      a: () => {
        throw new Error('abc')
      }
    }, { a: 1 })
      .should.be.rejectedWith(ValidationError, {
        errors: {
          a: 'abc'
        }
      })
  })
})
