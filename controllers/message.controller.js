const { response } = require('express');
const { Message, Chat } = require('../models');
const { handleUpload } = require('../config/cloudinary');

module.exports = {
  createMessage: async (req, res = response) => {
    const { chat, text } = req.body;
    let docs = null;
    const chatFound = await Chat.findById(chat);
    if (!chatFound) {
      return res.status(400).json({ msg: 'No existe el chat' });
    }
    let cldRes = null;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
      cldRes = await handleUpload(dataURI);
    }
    if (cldRes) {
      // req.body.avatar = cldRes.secure_url;
      // return res.json(cldRes.secure_url);
      docs = cldRes.secure_url;
    }

    const data = {
      chat,
      text,
      sender: req.user._id,
      docs,
    };

    const message = new Message(data);
    await message.save();
    chatFound.messages.push(message);
    // await chatFound.save();

    return res.status(201).json(message);
  },
  getMessages: async (req, res = response) => {
    const { limit = 5, skip = 0 } = req.query;
    try {
      const [total, messages] = await Promise.all([
        Message.countDocuments({
          sender: req.user._id,
        }),
        Message.find({
          sender: req.user._id,
        })
          .limit(Number(limit))
          .skip(Number(skip)),
      ]);

      return res.json({ total, messages });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  getMessage: async (req, res = response) => {
    const { id } = req.params;

    try {
      const message = await Message.findById(id);
      if (!message) {
        return res.status(404).json({ msg: 'No existe el mensaje' });
      }
      if (message.sender.toString() !== req.user._id.toString()) {
        return res.status(401).json({ msg: 'No autorizado' });
      }

      return res.json({ msg: 'ok', message });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  updateMessage: async (req, res = response) => {
    const { id } = req.params;

    const { text } = req.body;
    try {
      const message = await Message.findByIdAndUpdate(id, {
        text,
        new: true,
      });
      return res.json(message);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  deleteMessage: async (req, res = response) => {
    const { id } = req.params;
    try {
      const message = await Message.findByIdAndDelete(id);
      if (!message) {
        return res.status(404).json({ msg: 'No existe el mensaje' });
      }
      if (message.sender.toString() !== req.user._id.toString()) {
        return res.status(401).json({ msg: 'No autorizado' });
      }
      const chat = await Chat.findById(message.chat);
      chat.messages.pull(message._id);
      await chat.save();

      await Message.findByIdAndDelete(id);

      return res.json({ msg: 'ok borrado exitosamente', message });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
};
