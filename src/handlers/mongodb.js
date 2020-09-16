const { MongoClient } = require('mongodb')

const url = `mongodb://localhost:27017`

const client = new MongoClient(url)

async function run() {
  await client.connect()
  const database = client.db('sky-test')
  const collection = database.collection('users')
  await collection.createIndex( { 'email': 1 }, { unique: true } )
}

run().catch(console.dir)

module.exports = {
  client,
}
