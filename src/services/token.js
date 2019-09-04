const uuidv1 = require('uuid/v1')
const jwt = require('jsonwebtoken')
const config = require('config')

const publicKey = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`
const privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${process.env.PRIVATE_KEY}\n-----END RSA PRIVATE KEY-----`

const TokenException = function (status, code, message) {
  this.status = status
  this.code = code
  this.message = message
  this.name = 'TokenException'
}

const extractAccessToken = headers => {
  if (headers && headers.authorization && headers.authorization.indexOf('Bearer ') === 0) {
    return headers.authorization.split(' ')[1]
  } else {
    throw new TokenException(
      401,
      'ACCESS_TOKEN_MISSING',
      'Missing access token'
    )
  }
}

const getPayload = headers => {
  const token = extractAccessToken(headers)
  let payload

  try {
    payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
  } catch (error) {
    throw new TokenException(
      401,
      'TOKEN_SIGNATURE_INVALID',
      error.message.charAt(0).toUpperCase() + error.message.slice(1)
    )
  }
  if (!payload.clientId || !payload.userType || !payload.userId || !payload.tenantId) {
    throw new TokenException(
      401,
      'TOKEN_BUSINESS_CONTEXT_INVALID',
      'Missing required business context information'
    )
  }
  return payload
}

const getExpiracy = duration => {
  const dt = new Date()
  const exp = new Date(dt.getTime() + (duration * 60 * 1000))
  return Math.floor(exp.getTime() / 1000)
}

const genAccessToken = payload => {
  return jwt.sign(
    payload,
    privateKey,
    {
      algorithm: 'RS256',
      expiresIn: getExpiracy(config.token.duration),
      issuer: config.token.issuer,
      jwtid: uuidv1()
    }
  )
}

const isUSER = headers => {
  const payload = getPayload(headers)
  if (payload.type !== 'user') {
    throw new TokenException(
      401,
      'TOKEN_INVALID',
      'Invalid user type'
    )
  }
  return true
}

module.exports = {
  isUSER,
  genAccessToken
}
