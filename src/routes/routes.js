const express = require('express')
const { checkSchema } = require('express-validator')
const models = require('models')
const controllers = require('controllers')
const router = express.Router()

router.get('/', controllers.root.getStatus)

router.post('/auth/signin', checkSchema(models.auth.signin), controllers.auth.signin)
router.post('/auth/signup', checkSchema(models.auth.signup), controllers.auth.signup)
router.post('/auth/refresh', checkSchema(models.auth.refresh), controllers.auth.refresh)

module.exports = router
