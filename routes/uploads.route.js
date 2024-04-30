const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, validateFile } = require("../middlewares");

const { allowedCollections } = require("../helpers");

const { uploads: controller } = require("../controllers");

const router = Router();

router.post(
  "/",
  [validateFile, validateJWT, validateFields],
  controller.uploadFile
);

router.put(
  "/:collection/:id",
  [
    validateFile,
    validateJWT,
    check("id", "ID invalido").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["user", "product"])
    ),
    validateFields,
  ],
  controller.updateFile
);

router.get(
  "/:collection/:id",
  [
    validateJWT,
    check("id", "Id invalido").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["user", "product"])
    ),
    validateFields,
  ],
  controller.showImage
);

module.exports = router;
