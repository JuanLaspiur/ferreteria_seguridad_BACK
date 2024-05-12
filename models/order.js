const { Schema, model } = require('mongoose');

const OrderSchema = Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El comprador es obligatorio'],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El vendedor es obligatorio'],
    },
    offer: {
      type: Schema.Types.ObjectId,
      ref: 'Offer',
      required: [true, 'La oferta es obligatoria'],
    }, 
    products: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
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
    mercado_pago: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'pending'
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

OrderSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

// Here we remove the unique index on the 'offer' field
OrderSchema.index({ offer: 1 }, { unique: false });

module.exports = model('Order', OrderSchema);

