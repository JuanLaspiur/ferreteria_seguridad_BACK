const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const { chat: controller } = require('../controllers');

//const { chatExist } = require('../helpers/db-validators');

const router = Router();

router.get('/', validateJWT, controller.getChats);

router.get('/:id', validateJWT, controller.getChat);
// MAL HECHO JUAN
router.get('/malHECHO/:id', controller.getChat);

router.get('/forId/:userId', controller.getChatsByUserId);

//router.post(
//   '/',
//   [
//     validateJWT,
//     check('buyer', 'El comprador es obligatorio').not().isEmpty(),
//     check('seller', 'El vendedor es obligatorio').not().isEmpty(),
//     check('order', 'La orden es obligatorio').not().isEmpty(),
//     validateFields,
//  ],
//  controller.createChat,
//);

// router.put(
//   '/:id',
//   [
//     validateJWT,
//     //check('name').not().isEmpty(),
//     check('id').isMongoId(),
//     check('id').custom(chatExist),
//     validateFields,
//   ],
//   controller.updateChat,
// );

// router.delete(
//   '/:id',
//   [
//     validateJWT,
//     isAdminRole,
//     check('id', 'ID invalido').isMongoId(),
//     check('id').custom(chatExist),
//     validateFields,
//   ],
//   controller.deleteChat,
// );

module.exports = router;
