const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid');

const url = `mongodb://localhost:27017`

const client = new MongoClient(url)

async function run() {
  await client.connect()
  const database = client.db('sky-test')
  const collection = database.collection('users')
  await collection.createIndex( { 'email': 1 }, { unique: true } )
}
run().catch(console.dir)

async function fetchUser(user = {}) {
  await client.connect()
  const database = client.db('sky-test')
  const collection = database.collection('users')
  const findUser = await collection.findOne(user)
  return findUser
}

async function insertUser(user = {}) {
  await client.connect()
  const database = client.db('sky-test')
  const collection = database.collection('users')

  const dateNow = new Date()
  const _id = uuidv4()
  const token = uuidv4()

  await collection.insertOne({
    ...user,
    _id,
    token,
    data_criacao: dateNow,
    data_atualizacao: dateNow,
    ultimo_login: dateNow,
  })

  return true
}

async function loginUser(user = {}) {
  await client.connect()
  const database = client.db('sky-test')
  const collection = database.collection('users')
  const dateNow = new Date()
  const token = uuidv4()
  await collection.updateOne(user, { $set: { token, ultimo_login: dateNow } })
  return true
}

module.exports = {
  fetchUser,
  insertUser,
  loginUser,
}
