const { Router } = require('express');
const { check } = require('express-validator');

const {
  validateJWT,
  validateFields,
  isAdminRole,
  hasRole,
} = require('../middlewares');

const { service: controller } = require('../controllers');

const router = Router();

router.get(
  '/',
  //  validateJWT, hasRole('SELLER_ROLE'),
  controller.getServices,
);

router.get('/:id', validateJWT, controller.getService);

router.post(
  '/',
  [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty().isString(),
    validateFields,
    hasRole('ADMIN_ROLE'),
  ],
  validateJWT,
  controller.createService,
);

router.put(
  '/:id',
  [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty().isString(),

    validateFields,
  ],
  validateJWT,
  controller.updateService,
);

// router.delete(
//   '/:id',
//   [
//     validateJWT,
//     isAdminRole,
//     check('id', 'ID invalido').isMongoId(),
//     check('id').custom(serviceExist),
//     validateFields,
//     hasRole('USER_ROLE'),
//   ],
//   validateJWT,
//   controller.deleteService,
// );

module.exports = router;
