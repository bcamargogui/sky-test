const app = require('express')()
const routes = require('./src/routes')
const port = 3000

app.use('/', routes)

app.use(function(req, res, next) {
  responseError(
      res,
      'Endpoint não encontrado, verifique a url e tente novamente!',
      404,
  )
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
