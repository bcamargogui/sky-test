const app = require('express')()
const bodyParser = require('body-parser')
const { fetchUser, insertUser } = require('./mongodb')

// constants
const port = 3000

// generic functions
function response(resource = {}, data = {}, status = 200) {
  resource.status(status).send(data)
}

function responseError(
    resource = {},
    mensagem = 'Ops, algo deu errado, tente novamente mais tarde!') {
  resource.status(500).send({ mensagem })
}

// parse application/json
app.use(bodyParser.json())

// routes
app.get('/', (req, res) => {
  response(res, { online: true })
})

async function responseUser(user = {}) {
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

app.post('/sign-up', async (req, res) => {
  try {
    const { nome, email, senha, telefones } = req.body
    await insertUser({ nome, email, senha, telefones })
    const user = await responseUser({ email })
    response(res, user)
  } catch (error) {
    const { code, message } = error
    const duplicateKeyError = 11000
    if (code !== duplicateKeyError) responseError(res, message)
    responseError(res, 'E-mail já existente')
  }
})

app.post('/', (req, res) => {
  const { body } = req
  response(res, { body })
})

// application listener
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
