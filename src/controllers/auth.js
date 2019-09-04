const auth = require('services/auth')
const validator = require('services/validator')
const handleError = require('services/error')

const signin = async (req, res) => {
  try {
    validator.validate(req)
    res.status(200).send(
      await auth.signin(req.body)
    )
  } catch (error) {
    handleError(error)
  }
}

module.exports = {
  signin
}
