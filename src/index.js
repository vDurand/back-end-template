'use strict'
require('app-module-path').addPath(__dirname)
const express = require('express')
const morgan = require('morgan-body')
const routes = require('routes')
const config = require('config')

const port = process.env.PORT || config.server.port

;(async () => {
  const app = express()
  app.use(express.json())
  morgan(app, { skip: () => { return process.env.NODE_ENV === 'test' } })
  app.use(routes)
  await app.listen(port)
  console.log(`App running on port ${port}`)
})().catch((error) => {
  console.error(error)
})
