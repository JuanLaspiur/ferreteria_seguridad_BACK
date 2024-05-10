const { response } = require('express');
const { Chat, Message } = require('../models');

module.exports = {
  createChat: async (req, res = response) => {
    const { buyer, seller, offer } = req.body;

    const data = {
      buyer,
      seller,
      offer,
    };

    const chat = new Chat(data);
    await chat.save();

    return res.status(201).json(chat);
  },
  getChats: async (req, res = response) => {
    const { limit = 5, skip = 0 } = req.query;
    const userId = req.user._id;
    try {
      const [total, chats] = await Promise.all([
        Chat.countDocuments({
          $or: [{ seller: userId }, { buyer: userId }],
        }),
        Chat.find({ $or: [{ seller: userId }, { buyer: userId }] })
          .limit(Number(limit))
          .skip(Number(skip))
          .populate('offer')
          .populate('seller', ['name', 'avatar'])
          .populate('buyer', ['name', 'avatar'])
          .sort({ createdAt: -1 }),
      ]);

      return res.json({ total, chats });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  getChat: async (req, res = response) => {
    const { id } = req.params;

    try {
      const chat = await Chat.findById(id);
      if (!chat) {
        return res.status(404).json({ msg: 'Chat not found' });
      }
      const messages = await Message.find({ chat: id });

      chat.messages = messages;
      return res.json(chat);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  getChatsByUserId: async (req, res = response) => {
    const { userId } = req.params;
    try {
      const chats = await Chat.find({
        $or: [{ seller: userId }, { buyer: userId }],
      })
        .populate('offer')
        .populate('seller', ['name', 'avatar'])
        .populate('buyer', ['name', 'avatar'])
        .sort({ createdAt: -1 });

      const total = await Chat.countDocuments({
        $or: [{ seller: userId }, { buyer: userId }],
      });

      return res.json({ chats });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  updateChat: async (req, res = response) => {
    const { id } = req.params;

    const { state, ...data } = req.body;
    try {
      const chat = await Chat.findByIdAndUpdate(id, data, { new: true });
      return res.json(chat);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  deleteChat: async (req, res = response) => {
    const { id } = req.params;
    try {
      const chat = await Chat.findByIdAndDelete(id);

      return res.json(chat);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
};
