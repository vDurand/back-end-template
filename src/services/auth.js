const bcrypt = require('bcrypt')
const randtoken = require('rand-token')
const db = require('services/mongo')
const token = require('services/token')

const AuthException = function (status, code, message) {
  this.status = status
  this.code = code
  this.message = message
  this.name = 'AuthException'
}

const hashPassword = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

const comparePassword = (hashPassword, password) => {
  if (!bcrypt.compareSync(password, hashPassword)) {
    throw new AuthException(
      401,
      'PASSWORD_INVALID',
      'Wrong password'
    )
  }
}

const signin = async ({ email, password, nonce }) => {
  const user = await db.findOne('users', { email })
  comparePassword(user.password, password)
  const refreshToken = randtoken.uid(256)
  await db.updateOne('users', { refreshToken }, { email })
  return {
    token: {
      access: token.genAccessToken({
        nonce,
        sub: user.id,
        scope: user.scope
      }),
      refresh: refreshToken
    }
  }
}

const signup = async ({ email, password, passwordConfirm, nonce }) => {
  if (password !== passwordConfirm) {
    throw new AuthException(
      400,
      'PASSWORD_CONFIRMATION_INVALID',
      'Password confirmation does not match password'
    )
  }
  if (await db.findOne('users', { email })) {
    throw new AuthException(
      400,
      'EMAIL_CONFLICT',
      'Email address already in use'
    )
  }
  const refreshToken = randtoken.uid(256)
  const defaultScope = ['basic']
  const result = await db.insertOne('users', {
    email,
    password: hashPassword(password),
    scope: defaultScope,
    refreshToken
  })
  return {
    token: {
      access: token.genAccessToken({
        nonce,
        sub: result.insertedId,
        scope: defaultScope
      }),
      refresh: refreshToken
    }
  }
}

const refresh = async ({ refreshToken, nonce }) => {
  const user = await db.findOne('users', { refreshToken })
  if (!user) {
    throw new AuthException(
      401,
      'REFRESH_TOKEN_INVALID',
      'Refresh token not valid'
    )
  }
  return {
    token: {
      access: token.genAccessToken({
        nonce,
        sub: user.id,
        scope: user.scope
      })
    }
  }
}

module.exports = {
  signin,
  signup,
  refresh
}
