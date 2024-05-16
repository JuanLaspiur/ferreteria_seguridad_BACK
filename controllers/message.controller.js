const { response } = require("express");
const { Message, Chat } = require("../models");
const { handleUpload } = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { validationResult } = require('express-validator');
const {sendMessageNotification} = require('../helpers/send-notifications')


module.exports = {
  createMessage: async (req, res = response) => {
    const { chat, text, sender, docs } = req.body;

    const chatFound = await Chat.findById(chat);
    if (!chatFound) {
        return res.status(400).json({ msg: "No existe el chat" });
    }

 // Determine the recipient opposite to the sender to send message notification
    if (sender === chatFound.buyer) {
      sendMessageNotification(chatFound.seller._id, 'Mensaje recivido ', text);
    } else  {
      sendMessageNotification(chatFound.buyer._id, 'Mensaje recivido ', text);
    } 

    let cldRes = null;

    if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        cldRes = await handleUpload(dataURI);
    }

    let docsURL = null;
    if (cldRes) {
        docsURL = cldRes.secure_url;
    }

    const data = {
        chat,
        text,
        sender,
        docs,
    };

    const message = new Message(data);
    await message.save();
    chatFound.messages.push(message);
    await chatFound.save();

    return res.status(201).json(message);
}
,
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
        return res.status(404).json({ msg: "No existe el mensaje" });
      }
      if (message.sender.toString() !== req.user._id.toString()) {
        return res.status(401).json({ msg: "No autorizado" });
      }

      return res.json({ msg: "ok", message });
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
        return res.status(404).json({ msg: "No existe el mensaje" });
      }
      if (message.sender.toString() !== req.user._id.toString()) {
        return res.status(401).json({ msg: "No autorizado" });
      }
      const chat = await Chat.findById(message.chat);
      chat.messages.pull(message._id);
      await chat.save();

      await Message.findByIdAndDelete(id);

      return res.json({ msg: "ok borrado exitosamente", message });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  getChatMessages: async (req, res = response) => {
    const { chatId } = req.params;

    try {
      const chat = await Chat.findById(chatId).populate({
        path: "messages",
        options: {
          sort: { createdAt: -1 },
        },
      });

      if (!chat) {
        return res.status(404).json({ msg: "No existe el chat" });
      }

      return res.json(chat.messages);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ msg: "Error al obtener los mensajes del chat" });
    }
  },

  createImageMessage: async (req, res) => {
    try {
      if (!req.body || !req.body.imageData) {
        return res.status(400).json({ error: 'No image provided' });
      }  
      // Get image data in base64 format
      const imageData = req.body.imageData;
  
      const imageBuffer = Buffer.from(imageData, 'base64');
  
      // Generate a unique filename for the image
      const fileName = `image_${Date.now()}.webp`;
  
      // Destination path to save the image
      const folderPath = path.join(__dirname, '..', 'assets', 'chatImage');
      const imagePath = path.join(folderPath, fileName);
  
      // Convert the image to webp format
      const imageSharp = sharp(imageBuffer);
      await imageSharp.webp().toFile(imagePath);
  
      const newImageUri = `/assets/chatImage/${fileName}`;
  
      return res.status(201).json({ uri: newImageUri });
    } catch (error) {
      console.error('Error saving image:', error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  }
  , 
  getImageMessage: async (req, res) => {
    try {
        let queryInfo = req.params.imagePath;
        
        if (!queryInfo ) {
            return res.status(400).json({ error: 'No se proporcionó ninguna ruta de imagen' });
        }
        // Replace "-" with "/" in the URI.
        const imagePath = queryInfo.replace(/-/g, "/");
        const absoluteImagePath = path.join(__dirname, '..', imagePath);

        if (!fs.existsSync(absoluteImagePath)) {
            return res.status(404).json({ error: 'El archivo de imagen no se encontró' });
        }

        res.setHeader('Content-Type', 'image/webp');
        fs.createReadStream(absoluteImagePath).pipe(res);
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        return res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
} 


  

};
