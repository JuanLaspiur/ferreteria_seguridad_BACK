const { Router } = require("express");
const { check } = require("express-validator");

const {
  validateJWT,
  validateFields,
  isAdminRole,
  hasRole,
} = require("../middlewares");

const { offer: controller } = require("../controllers");

const { offerExist } = require("../helpers/db-validators");

const router = Router();
router.get("/getMyOffers", validateJWT, controller.getMyOffers);

router.get("/", validateJWT, controller.getOffers);

router.get(
  "/:id",
  // validateJWT, DESCOMENTAR
  controller.getOffer
);
router.get("/demand/:demandId", validateJWT, controller.getOffersByDemandId);
router.post(
  "/",
  //[
  //validateJWT,
  //  check('demand', 'La demanda es obligatoria').not().isEmpty(),
  // check('products', 'Los productos  de  la oferta son obligatorios')
  //   .not()
  //   .isEmpty()
  //   .isArray(),
  // validateFields,
  // hasRole('SELLER_ROLE'),
  //],
  controller.createOffer
);

router.put(
  "/:id",
  [
    validateJWT,
    check("demand", "La demanda es obligatoria").not().isEmpty(),
    check("products", "Los productos  de  la oferta son obligatorios")
      .not()
      .isEmpty()
      .isArray(),
    check("id").isMongoId(),
    check("id").custom(offerExist),
    validateFields,
  ],
  validateJWT,
  controller.updateOffer
);

router.
  put(
    "/updateStatus/:id",
 //   validateJWT,
    controller.updateOfferStatus
  );

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "ID invalido").isMongoId(),
    check("id").custom(offerExist),
    validateFields,
    hasRole("SELLER_ROL"),
  ],
  validateJWT,
  controller.deleteOffer
);

module.exports = router;
