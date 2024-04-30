const { Role, User, Category, Product } = require("../models");

module.exports = {
  validateRol: async (role = "") => {
    const exist = await Role.findOne({ role });
    if (!exist) throw new Error(`El rol: ${role} no es válido`);
  },
  userExist: async (email = "") => {
    const exist = await User.findOne({ email: email.toLocaleLowerCase() });
    if (!exist) throw new Error(`El email: ${email}, no esta registrado`);
  },
  emailExist: async (email = "") => {
    const exist = await User.findOne({ email });
    if (exist) throw new Error(`El email: ${email}, ya esta registrado`);
  },
  categoryExist: async (id = "") => {
    const exist = await Category.findById(id);
    if (!exist) throw new Error(`La categoria con ID ${id} no existe`);
  },
  userByIdExist: async (id = "") => {
    const exist = await User.findById(id);
    if (!exist) throw new Error(`El usuario con ID ${id} no existe`);
  },
  productExist: async (id = "") => {
    const exist = await Product.findById(id);
    if (!exist) throw new Error(`El producto con ID ${id} no existe`);
  },
  allowedCollections: (collection = "", collections = "") => {
    if (!collections.includes(collection))
      throw new Error(
        `La colección ${collection} no es válida - ${collections}`
      );
    return true;
  },
};
