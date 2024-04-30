const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
  //const token = req.header("Authorization");
  const authorization = req.get('Authorization');
  let token = null;
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7);
  }

  if (!token)
    return res.status(401).json({
      msg: 'No autorizado',
    });

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: 'Usuario no existe',
      });
    }

    if (!user.state) {
      return res.status(401).json({
        msg: 'Usuario eliminado',
      });
    }

    req.user = user;
    req.uid = uid;

    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      msg: 'Token invalido',
    });
  }
};

module.exports = {
  validateJWT,
};
