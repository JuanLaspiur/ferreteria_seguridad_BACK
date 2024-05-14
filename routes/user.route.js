// Librerias
const { Router } = require("express");
const { check } = require("express-validator");
const uploadsFiles = require("../config/multerfiles");

const cpUpload = uploadsFiles.fields([
  { name: "avatar", maxCount: 1 },
  { name: "files", maxCount: 5 },
]);

const {
  validateFields,
  validateJWT,
  hasRole,
  isAdminRole,
} = require("../middlewares");

// Validaciones
const {
  validateRol,
  emailExist,
  userByIdExist,
} = require("../helpers/db-validators");

// Controladores
const {
  userGet,
  userPut,
  userPost,
  userDelete,
  getAllSellers,
  getUserById,
  userUpdate,
  updateUserLocation 
} = require("../controllers/user.controller");

const router = Router();

router.get(
  "/",
  [
    check("limit", "limit debe ser un número").isNumeric(),
    check("skip", "skip debe ser un número"),
  ],
  userGet
);

router.get("/userId/:id", getUserById);

router.get("/allSellers", getAllSellers);

router.put(
  "/:id",
  [
    hasRole("ADMIN_ROLE", "USER_ROLE", "SELLER_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("email", "El email no es válido").isEmail(),
    check("id").custom(userByIdExist),
    check("role").custom(validateRol),
    validateFields,
  ],
  userPut
);
router.put("/update/:id", userUpdate); 

router.put('/location/:id', updateUserLocation);

router.post(
  "/",
  [
    check("email", "El email no es válido").isEmail(),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("lastname", "El apellido es obligatorio").not().isEmpty(),
    check("phone", "El telefono no es válido").isNumeric(),
    check("city", "Ciudad no es válido").not().isEmpty(),
    check("address", "La dirección no es válida").not().isEmpty(),
    check("birthdate", "Fecha no válida").not().isDate(),
    check(
      "password",
      "La contraseña es obligatoria, debe tener mas de 6 letras"
    ).isLength({ min: 6 }),
    // check('role').custom(validateRol),
    check("email").custom(emailExist),
    validateFields,
  ],
  userPost
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(userByIdExist),
    validateFields,
  ],
  userDelete
);

module.exports = router;
