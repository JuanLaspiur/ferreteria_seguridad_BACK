const { Schema, model } = require('mongoose');

const userSchema = Schema({
  name: {
    type: String,
    required: [true, 'Nombre es obligatorio'],
  },
  lastname: {
    type: String,
    required: [true, 'Apillido es obligatorio'],
  },
  city: {
    type: String,
    required: [true, 'Ciudad es obligatoria'],
  },
  addresses: [
    {
      address: String,
      // required: [true, 'Dirección es obligatoria'],
    },
  ],
  // nit: {
  //   type: Number,
  //   required: [true, 'NIT es obligatorio'],
  //   unique: true,
  //   min: [1, 'El NIT debe ser mayor a 0'],
  // },
  phone: {
    type: Number,
    required: [true, 'Telefono es obligatorio'],
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
  },
  birthdate: {
    type: Date,
    required: [true, 'Fecha de nacimiento es obligatoria'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    require: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE', 'SELLER_ROLE'],
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
  services: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Service',
    },
  ],
  avatar: {
    type: String,
    required: false,
    default: '',
  },
  passwordToken: {
    type: String,
    required: false,
  },
  expoPushToken: {
    type:String,
    required:false
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
});

userSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  return { uid: _id, ...user };
};

module.exports = model('User', userSchema);
