const bcrypt = require('bcryptjs');
const { response, request } = require('express');
const User = require('../models/user');
const { userBody } = require('../helpers/parse-bodys');
const cloudinary = require('../config/cloudinary.js');
const {generateExpoPushToken} = require('../helpers/ExpoPushToken.js')
const { Expo } = require('expo-server-sdk');

// Crea una instancia de Expo
const expo = new Expo();
module.exports = {
  userGet: async (req = request, res = response) => {
    const { limit = 5, skip = 0 } = req.query;

    try {
      const [total, users] = await Promise.all([
        User.countDocuments(),
        User.find({ state: true }).limit(limit).skip(skip),
      ]);
      return res.json({ total, users });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  },
  userPut: async (req = request, res = response) => {
    const { id } = req.params;
    const { addresses, password, google, _id, ...rest } = req.body;

    const file =
      req.files && req.files['avatar'] ? req.files['avatar'][0] : null;

    if (file) {
      let images = '';
      const image = await cloudinary.uploader.upload(file.path, {
        folder: 'avatars',
      });

      images = image.secure_url;

      rest.avatar = images;
    }

    if (password) {
      const salt = bcrypt.genSaltSync();
      rest.password = bcrypt.hashSync(password, salt);
    }
    rest.addresses = addresses;

    const user = await User.findByIdAndUpdate(id, rest, {
      returnDocument: 'after',
    });

    return res.json({ msg: 'success', user });
  },
  userUpdate: async (req = request, res = response) => {
    const { id } = req.params;
    const updateFields = req.body;
  
    try {
      const user = await User.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
  
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      return res.json({ msg: 'success', user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  },
// Controlador para crear un nuevo usuario
userPost: async (req = request, res = response) => {
    console.log('Entre a crear un usuario en post');
    try {
        const body = userBody(req.body);
        console.log('Esta es la request ' + req.body);
        // Convierte el email a minúsculas
        body.email = body.email.toLowerCase();
        const address = body.address;
        body.addresses = [{ address }];

        const file = req.files && req.files['avatar'] ? req.files['avatar'][0] : null;

        if (file) {
            let images = '';
            const image = await cloudinary.uploader.upload(file.path, {
                folder: 'avatars',
            });

            images = image.secure_url;

            body.avatar = images;
        }

        // Obtén el token de notificación push de Expo
        let expoPushToken = req.body.expoPushToken;
        if (!expoPushToken || !Expo.isExpoPushToken(expoPushToken)) {
            // Si el token es inválido o no está presente, genera uno nuevo
            expoPushToken = await generateExpoPushToken();
        }

        // Agrega el atributo expoPushToken al objeto body
        body.expoPushToken = expoPushToken;

        // Crea un nuevo usuario
        const user = new User(body);
        
        // Encripta la contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(req.body.password, salt);

        // Guarda el usuario en la base de datos
        await user.save();

        return res.json({ msg: 'success', user });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: `A ocurrido un error: ${error.message}` });
    }
}
,
  userDelete: async (req = request, res = response) => {
    const { id } = req.params;

    try {
      const user = await User.findByIdAndUpdate(id, { state: false });
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: error.message });
    }
  },
  getAllSellers: async (req = request, res = response) => {
    try {
      const sellers = await User.find({ role: 'SELLER_ROLE' });
      return res.json(sellers);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  },
  getUserById: async (req = request, res = response) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  },

  updateUserLocation : async (req = request, res = response) => {
    const { id } = req.params;
    const { coordinates } = req.body; 
  
    try {
      const user = await User.findByIdAndUpdate(id, { location: { coordinates } }, { new: true });
  
      if (!user) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }
  
      return res.json({ msg: 'success', user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  }


  
  
};
