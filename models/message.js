const { Schema, model } = require('mongoose');

const MessageSchema = Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Usuario es obligatorio'],
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: [true, 'Chat es obligatorio'],
    },
    text: {
      type: String,
      required: [true, 'Mensage es obligatorio'],
    },
    docs: {
      type: String,
      required: false,
    },
    image: {
      type:String,
      required: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = model('Message', MessageSchema);
