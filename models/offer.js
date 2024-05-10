const { Schema, model } = require('mongoose');

const OfferSchema = Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Usuario es obligatorio'],
    },
    demand: {
      type: Schema.Types.ObjectId,
      ref: 'Demand',
      required: [true, 'Demanda es obligatorio'],
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
    },
    status: {
      type: String,
      enum: ['created', 'accepted', 'rejected', 'canceled'],
      default: 'created',
      required: false,
    },

    products: [
      {
        name: String,
        quantity: Number,
        price: Number,
       // description: String,
        // required: false,
      },
    ],
    total: {
      type: Number,
      default: 0,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    },
    delivery: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

OfferSchema.methods.toJSON = function () {
  const { __v, state, ...data } = this.toObject();
  return data;
};

module.exports = model('Offer', OfferSchema);
