const { Router } = require('express');
const { check } = require('express-validator');
const uploadsFiles = require('../config/multerfiles');
const uploads = require('../config/multer');


const multer = require('multer')
const fs = require('fs');
const path = require('path');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/chatImage'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage }); 





const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const { message: controller } = require('../controllers');

const router = Router();
router.get('/getImageMessage/:imagePath', controller.getImageMessage);
router.get('/', validateJWT, controller.getMessages);

router.get('/:id', validateJWT, controller.getMessage);

router.get('/chatId/:chatId', controller.getChatMessages);

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

router.post('/createImageMessage', upload.single('imageData'),controller.createImageMessage);


router.put(
  '/:id',
  [validateJWT, check('text').not().isEmpty(), validateFields],
  controller.updateMessage,
);

router.delete('/:id', [validateJWT, validateFields], controller.deleteMessage);

module.exports = router;
