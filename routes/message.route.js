const { Router } = require('express');
const { check } = require('express-validator');
const uploadsFiles = require('../config/multerfiles');
const uploads = require('../config/multer');
const multer = require('multer')

const upload = multer({dest:'assets/chatImage'});




const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const { message: controller } = require('../controllers');

const router = Router();

router.get('/', validateJWT, controller.getMessages);

router.get('/:id', validateJWT, controller.getMessage);

router.get('/chatId/:chatId', controller.getChatMessages);

router.post(
  '/',
  uploads.single('files', 8),
  [
    // validateJWT,
    // check('chat', 'El chat es obligatorio').not().isEmpty(),
    check('text', 'El mensaje es obligatorio').not().isEmpty(),
    validateFields,
  ],
  controller.createMessage,
);

router.post('/createImageMessage', upload.single('imageData'), (req, res) => {
 

  if(req.body.imageData){
    console.log('La imagen estaba en el body')
  } 
 if (!req.file) {
    return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
  }
  res.status(200).json({ message: 'Imagen cargada exitosamente', filename: req.file.filename });
});


router.put(
  '/:id',
  [validateJWT, check('text').not().isEmpty(), validateFields],
  controller.updateMessage,
);

router.delete('/:id', [validateJWT, validateFields], controller.deleteMessage);

module.exports = router;
