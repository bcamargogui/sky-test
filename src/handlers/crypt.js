const bcrypt = require('bcrypt')
const saltRounds = 10


async function encryptPass(pass = '') {
  return await bcrypt.hash(pass, saltRounds)
}

async function comparePass(pass = '', passHash = '') {
  return await bcrypt.compare(pass, passHash)
}


module.exports = {
  encryptPass,
  comparePass,

}
