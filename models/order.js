const { Schema, model } = require('mongoose');

const OderSchema = Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Usuario es obligatorio'],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    offer: {
      type: Schema.Types.ObjectId,
      ref: 'Offer',
      required: [true, 'Oferta es obligatorio'],
      unique: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    delivery: {
      type: Number,
      default: 0,
    },

    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    },
    payed: {
      type: Boolean,
      default: false,
    },
    // MercadoPago
    mercado_pago: {
      type: Boolean,
      default: false,
    },
    status: {
      type:String,
      default:'pending'
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

OderSchema.methods.toJSON = function () {
  const { __v, state, ...data } = this.toObject();
  return data;
};

module.exports = model('Order', OderSchema);
