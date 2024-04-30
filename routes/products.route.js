const { Router } = require("express");
const { check } = require("express-validator");

const {
  validateJWT,
  validateFields,
  isAdminRole,
  hasRole,
} = require("../middlewares");

const { products: controller } = require("../controllers");

const { productExist, categoryExist } = require("../helpers/db-validators");

const router = Router();

// Obtener todos los productos - Publico
router.get("/", controller.getProducts);

// Obtener un producto por ID - Publico
router.get(
  "/:id",
  [check("id").isMongoId().custom(productExist), validateFields],
  controller.getProduct
);

// Crear productos - privado - SELLER_ROL con token válido
router.post(
  "/",
/*  [
    validateJWT,
    hasRole("SELLER_ROL"),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("category", "La categoria es obligatoria").isMongoId(),
    check("category").custom(categoryExist),
    validateFields,
  ], */
  controller.createProduct
);

// Actualizar un producto por ID - privado - Admin
router.put(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "ID invalido").isMongoId(),
    check("id").custom(productExist),
    validateFields,
  ],
  controller.updateProduct
);

// Borrar un producto por ID - Admin
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "ID invalido").isMongoId(),
    check("id").custom(productExist),
    validateFields,
  ],
  controller.deleteProduct
);

module.exports = router;
