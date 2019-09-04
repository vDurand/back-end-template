const { validationResult } = require('express-validator')

const ValidatorException = function (status, code, message) {
  this.status = status
  this.code = code
  this.message = message
  this.name = 'ValidatorException'
}

const validate = req => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    let tmp
    throw new ValidatorException(
      400,
      'INPUT_INVALID',
      result.errors.reduce((acc, val) => {
        if (!tmp || tmp !== val.param) acc.push(val.msg)
        tmp = val.param
        return acc
      }, []).join(', ')
    )
  }
}

module.exports = { validate }
