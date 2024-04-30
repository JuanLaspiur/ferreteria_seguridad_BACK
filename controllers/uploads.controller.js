const path = require("path");
const fs = require("fs");

const { response } = require("express");

const { uploadFileHelper } = require("../helpers");

const placeholder_img = path.join(__dirname, "../assets", "no-image.jpg");

module.exports = {
  uploadFile: async (req, res = response) => {
    try {
      const name = await uploadFileHelper({
        files: req.files,
        folder: "background",
      });
      return res.json({
        msg: "Imagen cargada correctamente",
        name,
      });
    } catch (msg) {
      console.log(msg);
      return res.status(500).json({ msg });
    }
  },
  updateFile: async (req, res = response) => {
    const { id, collection } = req.params;

    try {
      const collectionModel = require(`../models/${collection}`);

      const model = await collectionModel.findById(id);

      if (!model)
        return res.status(400).json({
          msg: `No existe el ID:${id} en la colección ${collection}`,
        });

      if (model.img) {
        const pathImg = path.join(
          __dirname,
          "../uploads",
          collection,
          model.img
        );
        if (fs.existsSync(pathImg)) {
          fs.unlinkSync(pathImg);
        }
      }

      const name = await uploadFileHelper({
        files: req.files,
        folder: collection,
      });

      model.img = name;

      await model.save();

      return res.json({ msg: "Actualizado correctamente", model });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  },
  showImage: async (req, res = response) => {
    const { id, collection } = req.params;

    try {
      const collectionModel = require(`../models/${collection}`);

      const model = await collectionModel.findById(id);

      if (!model) return res.sendFile(placeholder_img);

      if (model.img) {
        const pathImg = path.join(
          __dirname,
          "../uploads",
          collection,
          model.img
        );
        if (fs.existsSync(pathImg)) {
          return res.sendFile(pathImg);
        } else {
          return res.sendFile(placeholder_img);
        }
      }

      return res.json({ msg: "Sin placeholder creado" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: error.message });
    }
  },
};
