function responseSuccess(resource = {}, data = {}, status = 200) {
  resource.status(status).send(data)
}

function responseError(
    resource = {},
    mensagem = 'Ops, algo deu errado, tente novamente mais tarde!',
    status = 500,
) {
  resource.status(status).send({ mensagem })
}

module.exports = {
  responseSuccess,
  responseError,
}
