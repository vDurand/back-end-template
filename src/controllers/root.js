const getStatus = async ({ headers }, res) => {
  res.status(200).send({ status: 'ok' })
}

module.exports = {
  getStatus
}
