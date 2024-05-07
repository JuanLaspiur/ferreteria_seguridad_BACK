const { Router } = require('express');
const { check } = require('express-validator');

const {
  validateJWT,
  validateFields,
  isAdminRole,
  hasRole,
} = require('../middlewares');

const { order: controller } = require('../controllers');

const { orderExist } = require('../helpers/db-validators');

const router = Router();

router.get('/', validateJWT, controller.getOrders);

router.get('/:id', validateJWT, controller.getOrder);

router.post(
  '/',
/*  [
    validateJWT,
    check('offer', 'La oferta es obligatorio').not().isEmpty(),
    validateFields,
    hasRole('SELLER_ROLE'), // por que dice User_role? lo modifiqué a seller_role
  ], */

  controller.createOrder,
);

router.put(
  '/:id',
  [
    validateJWT,
    //check('name').not().isEmpty(),
    check('id').isMongoId(),
    check('id').custom(orderExist),
    validateFields,
    hasRole('USER_ROLE'),
  ],
  controller.updateOrder,
);
router.put(
  '/orderState/:id',
 /* [
    validateJWT,
    //check('name').not().isEmpty(),
    check('id').isMongoId(),
    check('id').custom(orderExist),
    validateFields,
    hasRole('USER_ROLE'),
  ], */
  controller.updateOrderStatus,
);
router.delete(
  '/:id',
  [
    validateJWT,
    isAdminRole,
    check('id', 'ID invalido').isMongoId(),
    check('id').custom(orderExist),
    validateFields,
    hasRole('ADMIN_ROLE'),
  ],
  controller.deleteOrder,
);

module.exports = router;
