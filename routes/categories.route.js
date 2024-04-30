const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, validateFields, isAdminRole } = require("../middlewares");

const { categories: controller } = require("../controllers");

const { categoryExist } = require("../helpers/db-validators");

const router = Router();

// Obtener todas las categorias - Publico
router.get("/", controller.getCategories);

// Obtener una categorias por ID - Publico
router.get(
  "/:id",
  [check("id").isMongoId().custom(categoryExist), validateFields],
  controller.getCategory
);

// Crear categorias - privado - cualquier persona con un token válido
router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields,
  ],
  controller.createCategory
);

// Actualizar un registro por ID - privado - cualquiera con token válido
router.put(
  "/:id",
  [
    validateJWT,
    check("name").not().isEmpty(),
    check("id").isMongoId(),
    check("id").custom(categoryExist),
    validateFields,
  ],
  controller.updateCategory
);

// Borrar una categoría por ID - Admin
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "ID invalido").isMongoId(),
    check("id").custom(categoryExist),
    validateFields,
  ],
  controller.deleteCategory
);

module.exports = router;
