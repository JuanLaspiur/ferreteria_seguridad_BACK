const { request, response } = require('express');
const User = require('../models/user');
const { generateJWT, tokenEmail } = require('../helpers/generate-jwt');
const bcrypt = require('bcryptjs');
const { googleVerify } = require('../helpers/google-verify');
const { handleUpload } = require('../config/cloudinary');
const { sendMailAsync } = require('../helpers/generate-invitation');

module.exports = {
  login: async (req = request, res = response) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email.toLowerCase() });

      const match = bcrypt.compareSync(password, user.password);
      if (!match) {
        return res.status(400).json({
          msg: 'Usuario / Contraseña no son correctos - contraseña',
        });
      }

      const token = await generateJWT(user._id);

      return res.json({
        user,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: `A ocurrido un error: ${error.message}`,
      });
    }
  },
  googleSignIn: async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
      const { email, name, picture } = await googleVerify(id_token);

      let user = await User.findOne({ email });

      if (!user) {
        // Crear usuario
        const data = {
          name,
          email,
          password: ':p',
          google: true,
          img: picture,
        };

        user = new User(data);
        await user.save();
      }
      // Si el usuario en DB
      if (!user.state) {
        return res.status(401).json({
          msg: 'Hable con el administrador, usuario bloqueado',
        });
      }

      const token = await generateJWT(user._id);

      return res.json({
        msg: 'ok',
        user,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        msg: `A ocurrido un error: ${error.message}`,
      });
    }
  },

  profile: async (req = request, res = response) => {
    const user = await User.findById(req.user._id).populate('services');
    if (!user) {
      return res.status(404).json({
        msg: 'Usuario no encontrado',
      });
    }
    user.password = null;

    return res.json(user);
  },

  editProfile: async (req = request, res = response) => {
    const { name, email, img, addresses, phone, services, city } = req.body;
    try {
      let cldRes = null;

      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
        cldRes = await handleUpload(dataURI);
      }
      if (cldRes) {
        req.body.avatar = cldRes.secure_url;
      }
      const avatar = req.body.avatar;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          name,
          email,
          img,
          addresses,
          phone,
          services,
          avatar,
          city,
        },
        { new: true },
      );

      return res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        msg: 'A ocurrido un error',
      });
    }
  },

  changePassword: async (req = request, res = response) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          msg: 'Usuario no encontrado',
        });
      }
      const token = await tokenEmail();

      //update  user passwordToken to toke
      user.passwordToken = token;
      await user.save();

      const html = `<p>Hola: has solicitado reestablecer tu password</p>
      <p>Sigue el siguiente codigo : ${token} para generar un nuevo password:
      <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>

      `;

      const mailOptions = {
        from: 'sender@server.com',
        to: email,
        subject: 'Cambio de contraseña ',
        html,
      };

      await sendMailAsync(mailOptions);

      return res.json('token enviado al email');
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        msg: 'A ocurrido un error',
      });
    }
  },

  checkToken: async (req = request, res = response) => {
    const { token, email } = req.body;
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          msg: 'Usuario no encontrado',
        });
      }

      if (user.passwordToken !== token) {
        return res.status(401).json({
          msg: 'Token no valido',
        });
      }
      return res.json({
        msg: 'ok',
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        msg: 'A ocurrido un error',
      });
    }
  },
  newPassword: async (req = request, res = response) => {
    const { password, email, token } = req.body;
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({
          msg: 'Usuario no encontrado',
        });
      }
      if (user.passwordToken !== token) {
        return res.status(404).json({
          msg: 'Token no valido',
        });
      }
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(req.body.password, salt);
      user.passwordToken = null;

      await user.save();

      return res.json({
        msg: 'contraseña cambiada',
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        msg: 'A ocurrido un error',
      });
    }
  },
};
