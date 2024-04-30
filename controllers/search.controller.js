const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const { User, Category, Product } = require("../models");

const allowedCollections = ["user", "category", "product"];

const searchUsers = async (term = "", res = response) => {
  const isMongoID = isValidObjectId(term);

  if (isMongoID) {
    const user = await User.findById(term);
    return res.json({ results: user ? [user] : [] });
  }

  const regex = new RegExp(term, "i");

  const query = {
    $and: [{ $or: [{ name: regex }, { email: regex }] }, { state: true }],
  };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query),
  ]);

  return res.json({ total, results: users });
};

const searchCategory = async (term = "", res = response) => {
  const isMongoID = isValidObjectId(term);

  if (isMongoID) {
    const category = await Category.findById(term);
    return res.json({ results: category ? [category] : [] });
  }

  const query = {
    $and: [{ name: regex }, { state: true }],
  };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query),
  ]);

  return res.json({ total, results: categories });
};

const searchProduct = async (term = "", res = response) => {
  const isMongoID = isValidObjectId(term);

  if (isMongoID) {
    const product = await Product.findById(term).populate("category", ["name"]);
    return res.json({ results: product ? [product] : [] });
  }

  const query = {
    $and: [{ name: regex }, { state: true }],
  };

  const [total, products] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query).populate("category", ["name"]),
  ]);

  return res.json({ total, results: products });
};

module.exports = {
  search: async (req, res = response) => {
    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) {
      return res.status(400).json({
        msg: `La colección ${collection} no existe`,
      });
    }

    switch (collection) {
      case "user":
        return searchUsers(term, res);
      case "category":
        return searchCategory(term, res);
      case "product":
        return searchProduct(term, res);
      default:
        return res
          .status(500)
          .json({ msg: `No hay busqueda para ${collection} implementada` });
    }
  },
};
