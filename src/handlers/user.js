const { encryptPass } = require('./crypt')
const { client } = require('./mongodb')
const { getGuid, getJWT } = require('./token')

const databaseName = 'sky-test'
const collectionName = 'users'

async function fetchUser(user = {}) {
  await client.connect()
  const database = client.db('sky-test')
  const collection = database.collection('users')
  const findUser = await collection.findOne(user)
  return findUser
}

async function insertUser(user = {}) {
  await client.connect()
  const database = client.db(databaseName)
  const collection = database.collection(collectionName)

  const dateNow = new Date()
  const _id = getGuid()

  const { email } = user
  const token = getJWT({ email })
  const senha = await encryptPass(user.senha)

  await collection.insertOne({
    ...user,
    senha,
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
  const database = client.db(databaseName)
  const collection = database.collection(collectionName)
  const dateNow = new Date()

  const { email } = user
  const token = getJWT({ email })

  await collection.updateOne(user, { $set: { token, ultimo_login: dateNow } })
  return true
}

async function fetchParsedUser(user = {}) {
  const {
    _id,
    data_criacao,
    data_atualizacao,
    ultimo_login,
    token,
  } = await fetchUser(user)

  return {
    data_criacao,
    data_atualizacao,
    ultimo_login,
    token,
    id: _id,
  }
}

module.exports = {
  fetchUser,
  insertUser,
  loginUser,
  fetchParsedUser,
}
