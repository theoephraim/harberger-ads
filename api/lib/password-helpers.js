const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  return bcrypt.hash(password, 5);
}

async function checkPasswordAgainstHash(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}


module.exports = {
  hashPassword, checkPasswordAgainstHash,
};
