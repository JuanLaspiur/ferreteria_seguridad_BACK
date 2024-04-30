const { request, response } = require("express");
const { Category } = require("../models");

module.exports = {
  createCategory: async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if (categoryDB) {
      return res.status(400).json({ msg: `La categoría ${name} ya existe` });
    }

    const data = {
      name,
      user: req.user._id,
    };

    const category = new Category(data);
    await category.save();

    return res.status(201).json(category);
  },
  getCategories: async (req = request, res = response) => {
    const { limit = 5, skip = 0 } = req.query;
    try {
      const [total, categories] = await Promise.all([
        Category.countDocuments(),
        Category.find({ state: true })
          .limit(Number(limit))
          .skip(Number(skip))
          .populate("user", ["name"]),
      ]);
      return res.json({ total, categories });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: `A ocurrido un error ${error.message}`,
      });
    }
  },
  getCategory: async (req = request, res = response) => {
    const { id } = req.params;

    try {
      const category = await Category.findById(id).populate("user", ["name"]);

      return res.json({ msg: "ok", category });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  updateCategory: async (req, res = response) => {
    const { id } = req.params;

    const { state, user, ...data } = req.body;

    try {
      data.name = data.name.toUpperCase();
      data.user = req.user._id;

      const category = await Category.findByIdAndUpdate(id, data, {
        new: true,
      });
      return res.json(category);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  deleteCategory: async (req, res = response) => {
    const { id } = req.params;

    try {
      const deletedCategory = await Category.findByIdAndUpdate(id, {
        state: false,
        new: true,
      });

      return res.json(deletedCategory);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
};
