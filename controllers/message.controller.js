const { response } = require("express");
const { Message, Chat } = require("../models");
const { handleUpload } = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

module.exports = {
  createMessage: async (req, res = response) => {
    const { chat, text, sender, docs } = req.body;

    const chatFound = await Chat.findById(chat);
    if (!chatFound) {
      return res.status(400).json({ msg: "No existe el chat" });
    }
    let cldRes = null;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
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
      sender,
      docs,
    };

    const message = new Message(data);
    await message.save();
    chatFound.messages.push(message);
    await chatFound.save();

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
  createImageMessage: async (req, res = response) => {
    console.error('Entre ')
    const { imageUrl  } = req.body;
    console.error('Url de la imagen ' + imageUrl)
   /* try {
      console.error('ENTRE ')
      // Verificar si existe la carpeta, si no, crearla
      const folderPath = path.join(__dirname, "assess", "imagenChat");
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Obtener la URI de la imagen del cuerpo de la solicitud
      const { imageUrl  } = req.body;

      // Generar un nombre de archivo único para la imagen (puedes utilizar un paquete como `uuid`)
      const fileName = `image_${Date.now()}.webp`;

      // Ruta de destino para guardar la imagen
      const imagePath = path.join(folderPath, fileName);

      // Convertir la imagen a formato WebP utilizando Sharp
      await sharp(image).toFormat("webp").toFile(imagePath);

      // Construir la nueva URI de la imagen basada en la ubicación donde se guardó
      const newImageUri = `/assess/imagenChat/${fileName}`;

      return res
        .status(201)
        .json({ uri: newImageUri });
    } catch (error) {
      console.error("Error al guardar la imagen:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    } */
  },
};
