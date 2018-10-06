const nconf = require('nconf');
const crypto = require('crypto');

const iv = nconf.get('CRYPTO:iv');
const cryptoKey = nconf.get('CRYPTO:key');
const CIPHER_NAME = nconf.get('CRYPTO:cipher_name') || 'aes-256-cbc';
const CRYPTO_DISABLE = nconf.get('CRYPTO:disable');

function encrypt(plaintext) {
  if (CRYPTO_DISABLE) return plaintext;
  if (!plaintext) return null;
  const cipher = crypto.createCipheriv(CIPHER_NAME, cryptoKey, iv);
  return cipher.update(plaintext.toString(), 'utf8', 'base64') + cipher.final('base64');
}

function decrypt(encryptedString) {
  if (CRYPTO_DISABLE) return encryptedString;
  if (!encryptedString) return null;
  const decipher = crypto.createDecipheriv(CIPHER_NAME, cryptoKey, iv);
  return decipher.update(encryptedString, 'base64') + decipher.final();
}

module.exports = {
  encrypt,
  decrypt,
};
