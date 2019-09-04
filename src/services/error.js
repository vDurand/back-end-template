const parse = error => {
  let status = 500
  const data = {
    category: 'ERROR',
    code: 'INTERNAL',
    text: 'Unexplained error'
  }

  if (error.response && error.response.status && error.response.data && error.response.data.error_description) {
    status = error.response.status
    data.code = error.response.data.error
    data.text = error.response.data.error_description
  } else if (error.status && error.message && error.code) {
    status = error.status
    data.code = error.code
    data.text = error.message
  } else if (error.message) {
    data.text = error.message
  }

  return { status, data }
}

const handleError = (res, error) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(error)
  }
  const errObject = parse(error)
  res.status(errObject.status).send(errObject.data)
}

module.exports = handleError
