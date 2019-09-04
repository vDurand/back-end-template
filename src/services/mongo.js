const MongoDb = require('mongodb')
const client = MongoDb.MongoClient

let connection

const MongoException = function (status, code, message) {
  this.status = status
  this.code = code
  this.message = message
  this.name = 'MongoException'
}

const parseFilters = filters => {
  try {
    for (const key in filters) {
      if (key === '_id') {
        filters[key] = MongoDb.ObjectId(filters[key])
        return
      }
    }
  } catch (error) {
    throw new MongoException(
      400,
      'ID_INVALID',
      'Id must be string of 24 hex characters'
    )
  }
}

const getConnection = async () => {
  if (!connection) connection = await client.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  return connection
}

const close = async () => {
  if (connection) {
    await connection.close()
    connection = null
  }
}

const insertMany = async (collection, data) => {
  const con = await getConnection()
  const res = await con.db()
    .collection(collection)
    .insertMany(data)
  return res
}

const insertOne = async (collection, data) => {
  const con = await getConnection()
  const res = await con.db()
    .collection(collection)
    .insertOne(data)
  return res
}

const updateMany = async (collection, data, filter = {}) => {
  parseFilters(filter)
  data = { $set: data }
  const con = await getConnection()
  const res = await con.db()
    .collection(collection)
    .updateMany(filter, data, { upsert: true })
  return res
}

const updateOne = async (collection, data, filter = {}) => {
  parseFilters(filter)
  data = { $set: data }
  const con = await getConnection()
  const res = await con.db()
    .collection(collection)
    .updateOne(filter, data)
  return res
}

const findMany = async (collection, filter = {}) => {
  parseFilters(filter)
  const con = await getConnection()
  const res = await con.db()
    .collection(collection)
    .find(filter)
    .toArray()
  return res
}

const findOne = async (collection, filter = {}) => {
  parseFilters(filter)
  const con = await getConnection()
  const res = await con.db()
    .collection(collection)
    .findOne(filter)
  return res
}

const findRange = async (collection, filter = {}, offset = 0, limit = 50) => {
  parseFilters(filter)
  const con = await getConnection()
  const res = await con.db()
    .collection(collection)
    .find(filter)
    .skip(offset)
    .limit(limit)
    .toArray()
  return res
}

const count = async (collection, filter = {}) => {
  parseFilters(filter)
  const con = await getConnection()
  const res = await con.db()
    .collection(collection)
    .countDocuments(filter)
  return res
}

const deleteOne = async (collection, filter = {}) => {
  parseFilters(filter)
  const con = await getConnection()
  const res = await con.db()
    .collection(collection)
    .deleteOne(filter)
  return res
}

const deleteMany = async (collection, filter = {}) => {
  parseFilters(filter)
  const con = await getConnection()
  const res = await con.db()
    .collection(collection)
    .deleteMany(filter)
  return res
}

module.exports = {
  close,
  insertMany,
  insertOne,
  updateMany,
  updateOne,
  findMany,
  findOne,
  findRange,
  count,
  deleteOne,
  deleteMany
}
