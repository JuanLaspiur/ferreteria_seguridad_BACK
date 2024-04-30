const { response } = require('express');
const { Product } = require('../models');

module.exports = {
  createProduct: async (req, res = response) => {
    const { name, price, category, description } = req.body;

    const productDB = await Product.findOne({ name });

    if (productDB) {
      return res.status(400).json({ msg: `El producto ${name} ya existe` });
    }

    const data = {
      name,
      price,
      category,
      description,
      user: req.user._id,
    };

    const product = new Product(data);
    await product.save();

    return res.status(201).json(product);
  },
  getProducts: async (req, res = response) => {
    const { limit = 5, skip = 0 } = req.query;
    try {
      const [total, products] = await Promise.all([
        Product.countDocuments(),
        Product.find({ state: true })
          .limit(Number(limit))
          .skip(Number(skip))
          .populate('category', ['name'])
          .populate('user', ['name'])
          .sort({ createdAt: -1 }),
      ]);

      return res.json({ total, products });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  getProduct: async (req, res = response) => {
    const { id } = req.params;

    try {
      const product = await Product.findById(id)
        .populate('category', ['name'])
        .populate('user', ['name']);

      return res.json({ msg: 'ok', product });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  updateProduct: async (req, res = response) => {
    const { id } = req.params;

    const { state, ...data } = req.body;
    try {
      const product = await Product.findByIdAndUpdate(id, data, { new: true });
      return res.json(product);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  deleteProduct: async (req, res = response) => {
    const { id } = req.params;
    try {
      const product = await Product.findByIdAndUpdate(id, {
        state: false,
        new: true,
      });

      return res.json(product);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
};
