const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const jwtPass = 'role21'

function extractBearekToken(token = '') {
  const replaceWord = 'Bearer '
  return token.replace(replaceWord, '')
}

function getGuid() {
  return uuidv4()
}

function getJWT(data = {}) {
  return jwt.sign({ data }, jwtPass)
}

module.exports = {
  extractBearekToken,
  getGuid,
  getJWT,
}
