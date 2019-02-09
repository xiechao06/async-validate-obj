# async-validate-obj
a utility supports asynchronous validation

## Motivation

Validation a form is a common task, I need a validation tool that:

* run asynchronously

```javascript
await validateObj({
    foo: someAsyncChecker,
}, obj)
```
* curried validation function

```javascript
let validator = validateObj({
    foo: someAsyncChecker
})
await validator(obj)
```

* nested object validation

```javascript
await validateObj({
    foo: { bar: barChecker }
}, { foo: { bar: 1 } })
```

* array of checkers applied to one field

```javascript
await validateObj({
    foo: [fooChecker1, fooChecker2]
}, obj)
```

## Usage

### esm way

```javascript
import { validateObj, checkers } from 'async-validate-obj'
```

### commonjs way

```javascript
const { validateObj, checkers } = require('async-validate-obj')
```

## Example

```javascript
import { validateObj, checkers, ValidationError } from 'async-validate-obj'
import emailRegex from 'email-regex'

async submit(user) {
    try {
        await validateObj({
            name: checkers.required(),
            email: checkers.match(emailRegex(), 'should be a valid email'),
            pet: {
                kind: async function (kind) {
                    if (!await checkPetKind(kind)) {
                        throw new Error('pet is not allowed')
                    }
                }
            }
        }, user)
    } catch (e) {
        if (e instanceof ValidationError) {
            console.error(e.errors)
        }
        throw error
    }
}
```

## API

### validateObj(rules, obj)

#### params

* rules - an object that matches the structure of the obj wait to be validated. The value
  is a checker or an array of checkers. each checker is a (asynchronous) function who gets two parameters, the first one is the value of matching field of obj, the second one is the obj. and `this` points to the current nested object, for example:

    ```javascript
    validateObj({
        a: {
            b: function bChecker(b, root) {
            // b will be 1
            // root will be { a: { b: 1 } }
            // *this* will be {b: 1}
            }
        }
    }, { a: { b: 1 } })
    ```
  if an array of checkers provided, the field will be validated one by one, until
  an error met.

  a checker could throw an error or return a rejected promise when validation is failed

* obj - the object to be validated, if not provided, a curried function will be returned

#### return

a promise, if all validations passed, it will be resolved, otherwise it will be rejected
with an error of type `ValidationError`, it will has a field `errors`, which holds the
details.

```javascript
import { checkers, validateObj, ValidationError } from 'async-validate-obj'

validateObj({
    a: required('a can not be empty')
}, {})
  .catch(function (err) {
    if (err instanceof ValidationError) {
      console.log(err.errors) // { a: 'a can not be empty' }
    }
    throw err
  })
```

### checkers.required(message)

check if a field is empty, if not, throw an error with the given message.

#### parameters

* message - optional, if not provided, it defaults to 'should not be empty'

### checkers.match(regex, message)

check if a field matches regex, if not, throw an error with the given message.

#### parameters

* message - optional, if not provided, it defaults to *'does not match pattern ' + regex*
* regex - regular expression to be matched

## Developement

```bash
$ git clone https://github.com/xiechao06/async-validate-obj.git
$ cd async-validate-obj
$ npm ci
$ npm run dev # watch and test
$ npm run build
```

