const { Schema, model } = require('mongoose');

const DemandSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Usuario es obligatorio'],
    },
    type: {
      type: String,
      enum: ['product', 'service'],
      default: 'product',
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    paymentType: {
      type: String,
      enum: ['card', 'cash'],
    },
    products: [
      {
        name: String, //martillo
        quantity: Number, //5
        // required: false,
      },
    ],

    offers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Offer',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

DemandSchema.methods.toJSON = function () {
  const { __v, state, ...data } = this.toObject();
  return data;
};

module.exports = model('Demand', DemandSchema);
