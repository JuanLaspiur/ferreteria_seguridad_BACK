const { Router } = require('express');
const { check } = require('express-validator');
const uploadsFiles = require('../config/multerfiles');
const uploads = require('../config/multer');
const multer = require('multer')
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/chatImage'); // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    // Puedes mantener el nombre original del archivo si lo deseas
    cb(null, file.originalname);
  }
});

// Aumenta el límite de tamaño permitido a 50 MB (en bytes)
const limits = {
  fileSize: 50 * 1024 * 1024 // 50 MB
};

// Crea la instancia de Multer con la configuración y límites
const upload = multer({ storage: storage, limits: limits });




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
  // Verificar si se subió correctamente el archivo
  if (!req.file) {
    return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
  }
  
  // Aquí puedes procesar los datos de la imagen como lo desees
  console.log('Imagen recibida:', req.file.filename);
  
  // Puedes devolver una respuesta adecuada
  res.status(200).json({ message: 'Imagen guardada exitosamente', filename: req.file.filename });
});


router.put(
  '/:id',
  [validateJWT, check('text').not().isEmpty(), validateFields],
  controller.updateMessage,
);

router.delete('/:id', [validateJWT, validateFields], controller.deleteMessage);

module.exports = router;
