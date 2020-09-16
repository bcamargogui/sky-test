const app = require('express')()
const { comparePass } = require('../handlers/crypt')
const { responseSuccess, responseError } = require('../handlers/response')
const {
  fetchUser,
  fetchParsedUser,
  insertUser,
  loginUser,
} = require('../handlers/user')
const { extractBearekToken } = require('../handlers/token')
const { subtractMinutes } = require('../handlers/date')

const bodyParser = require('body-parser')
app.use(bodyParser.json())


app.get('/', (req, res) => responseSuccess(res, { online: true }))

app.post('/sign-up', async (req, res) => {
  try {
    const { nome, email, senha, telefones } = req.body
    await insertUser({ nome, email, senha, telefones })
    const user = await fetchParsedUser({ email })
    responseSuccess(res, user)
  } catch (error) {
    const { code, message } = error
    const duplicateKeyError = 11000
    if (code !== duplicateKeyError) return responseError(res, message)
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
    const userResponse = await fetchParsedUser({ email })
    responseSuccess(res, userResponse)
  } catch (error) {
    const { message } = error
    responseError(res, message)
  }
})

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

    const tokenLimitMinutes = 30
    const thirtyMinutesLaterDate = subtractMinutes(tokenLimitMinutes, dateNow)
    const tokenStillValid = user.ultimo_login >= thirtyMinutesLaterDate

    if (!tokenStillValid) return responseError(res, 'Sessão inválida', 401)

    const parsedUser = await fetchParsedUser(user)
    responseSuccess(res, parsedUser)
  } catch (error) {
    const { message } = error
    responseError(res, message)
  }
})

module.exports = app
