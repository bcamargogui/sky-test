const app = require('express')()
const bodyParser = require('body-parser')

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
  // response(res, { success: true })
  responseError(res, 'Ops, algo deu errado')
})

app.post('/', (req, res) => {
  const { body } = req
  response(res, { body })
})

// application listener
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
