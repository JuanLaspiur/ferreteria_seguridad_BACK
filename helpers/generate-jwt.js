require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid: uid.toString() };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: '24h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('No se pudo generar el token');
        } else {
          resolve(token);
        }
      },
    );
  });
};

const tokenEmail = async () => {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
};

module.exports = {
  generateJWT,
  tokenEmail,
};
