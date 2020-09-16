const app = require('express')()
const bodyParser = require('body-parser')
const { fetchUser, insertUser, loginUser } = require('./mongodb')
const { comparePass } = require('./crypt')

// constants
const port = 3000

// generic functions
function response(resource = {}, data = {}, status = 200) {
  resource.status(status).send(data)
}

function responseError(
    resource = {},
    mensagem = 'Ops, algo deu errado, tente novamente mais tarde!',
    status = 500,
) {
  resource.status(status).send({ mensagem })
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

app.post('/sign-in', async (req, res) => {
  const errorMessage = 'Usuário e/ou senha inválidos'

  try {
    const { email, senha } = req.body
    const user = await fetchUser({ email })
    if (!user) return responseError(res, errorMessage)

    const isSamePass = await comparePass(senha, user.senha)
    if (!isSamePass) return responseError(res, errorMessage, 401)

    await loginUser({ email })
    const userResponse = await responseUser({ email })
    response(res, userResponse)
  } catch (error) {
    const { message } = error
    responseError(res, message)
  }
})

function extractBearekToken(token = '') {
  const replaceWord = 'Bearer '
  return token.replace(replaceWord, '')
}

app.get('/search-user/:user_id', async (req, res) => {
  const noAuthorizedMessage = 'Não autorizado'
  const dateNow = new Date()

  try {
    const { authorization } = req.headers
    if (!authorization) return responseError(res, noAuthorizedMessage, 401)

    const { user_id } = req.params
    const user = await fetchUser({ _id: user_id })
    if (!user) throw new Error('Usuário não encontrado')

    const token = extractBearekToken(authorization)
    if (token !== user.token) {
      return responseError(res, noAuthorizedMessage, 401)
    }

    const MS_PER_MINUTE = 60000
    const tokenLimitMinutes = 30
    const thirtyMinutesLaterDate = new Date(
        dateNow -
      tokenLimitMinutes *
      MS_PER_MINUTE,
    )
    const tokenStillValid = user.ultimo_login >= thirtyMinutesLaterDate

    if (!tokenStillValid) return responseError(res, 'Sessão inválida', 401)

    const parsedUser = await responseUser(user)
    response(res, parsedUser)
  } catch (error) {
    const { message } = error
    responseError(res, message)
  }
})


app.use(function(req, res, next) {
  responseError(res,
      'Endpoint não encontrado, verifique a url e tente novamente!',
      404)
})

// application listener
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
