const { Schema, model } = require('mongoose');

const ChatSchema = Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comprador es obligatorio'],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vendedor es obligatorio'],
    },
    offer: {
      type: Schema.Types.ObjectId,
      ref: 'Offer',
      required: [true, 'Oferta es obligatoria 123'],
      unique: true,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ChatSchema.methods.toJSON = function () {
  const { __v, state, ...data } = this.toObject();
  return data;
};

module.exports = model('Chat', ChatSchema);
