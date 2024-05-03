const { Router } = require('express');
const { check } = require('express-validator');
const uploadsFiles = require('../config/multerfiles');
const uploads = require('../config/multer');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const { message: controller } = require('../controllers');

const router = Router();

router.get('/', validateJWT, controller.getMessages);

router.get('/:id', validateJWT, controller.getMessage);

router.post(
  '/',
  uploads.single('files', 8),
  [
    // validateJWT,
    check('chat', 'El chat es obligatorio').not().isEmpty(),
    check('text', 'El mensaje es obligatorio').not().isEmpty(),
    validateFields,
  ],
  controller.createMessage,
);

router.put(
  '/:id',
  [validateJWT, check('text').not().isEmpty(), validateFields],
  controller.updateMessage,
);

router.delete('/:id', [validateJWT, validateFields], controller.deleteMessage);

module.exports = router;
