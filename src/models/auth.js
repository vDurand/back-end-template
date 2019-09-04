const signin = {
  email: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing email',
      checkNull: true
    },
    isEmail: {
      errorMessage: 'Invalid email address'
    }
  },
  password: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing password',
      checkNull: true
    },
    isLength: {
      errorMessage: 'Password should be at least 7 characters long',
      options: { min: 7 }
    }
  },
  nonce: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing nonce',
      checkNull: true
    },
    isUUID: {
      errorMessage: 'Nonce should be a uuid'
    }
  }
}

const signup = {
  email: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing email',
      checkNull: true
    },
    isEmail: {
      errorMessage: 'Invalid email address'
    }
  },
  password: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing password',
      checkNull: true
    },
    isLength: {
      errorMessage: 'Password should be at least 7 characters long',
      options: { min: 7 }
    }
  },
  passwordConfirm: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing password confirmation',
      checkNull: true
    },
    isLength: {
      errorMessage: 'Password confirmation should be at least 7 characters long',
      options: { min: 7 }
    }
  },
  nonce: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing nonce',
      checkNull: true
    },
    isUUID: {
      errorMessage: 'Nonce should be a uuid'
    }
  }
}

const refresh = {
  refreshToken: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing refresh token',
      checkNull: true
    },
    isString: {
      errorMessage: 'Refresh token should be a string'
    },
    isLength: {
      errorMessage: 'Refresh token should be 256 characters long',
      options: { min: 256, max: 256 }
    }
  },
  nonce: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing nonce',
      checkNull: true
    },
    isUUID: {
      errorMessage: 'Nonce should be a uuid'
    }
  }
}

module.exports = {
  signin,
  signup,
  refresh
}
