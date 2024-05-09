const { Router } = require('express');
const { check } = require('express-validator');

const {
  validateJWT,
  validateFields,
  isAdminRole,
  hasRole,
} = require('../middlewares');

const { demand: controller } = require('../controllers');

const router = Router();

router.get(
  '/mydemands',
  validateJWT,
  hasRole('USER_ROLE'),
  controller.getMyDemands,
);

router.get('/myClientsDemands',  //  Nuevo metodo Juan 
validateJWT,
 // hasRole('SELLER_ROLE'),
controller.getMyClientsDemands)

router.get(
  '/',
  //  validateJWT, hasRole('SELLER_ROLE'),
  controller.getDemands,
);

router.get('/:id', validateJWT, controller.getDemand);

router.post(
  '/',
  [
    validateJWT,
    check('type', 'El tipo de demanda es obligatorio')
      .not()
      .isEmpty()
      .isString(),
    check('products', 'Productos es obligatorios').not().isEmpty(),
    check('paymentType', 'El tipo de pago es obligatorio es obligatoria')
      .not()
      .isEmpty(),
    validateFields,
    hasRole('USER_ROLE'),
  ],
  controller.createDemand,
);

// router.put(
//   '/:id',
//   [
//     validateJWT,
//     check('type', 'El tipo de demanda es obligatorio')
//       .not()
//       .isEmpty()
//       .isString(),
//     check('location', 'Localizacion es obligatoria').not().isEmpty().isArray(),
//     check('products', 'Productos es obligatorios').not().isEmpty().isArray(),
//     check('paymentType', 'El tipo de pago es obligatorio es obligatoria')
//       .not()
//       .isEmpty()
//       .isString(),
//     ,
//     check('id').isMongoId(),
//     check('id').custom(demandExist),
//     validateFields,
//   ],
//   validateJWT,
//   controller.updateDemand,
// );

// router.delete(
//   '/:id',
//   [
//     validateJWT,
//     isAdminRole,
//     check('id', 'ID invalido').isMongoId(),
//     check('id').custom(demandExist),
//     validateFields,
//     hasRole('USER_ROLE'),
//   ],
//   validateJWT,
//   controller.deleteDemand,
// );

module.exports = router;
