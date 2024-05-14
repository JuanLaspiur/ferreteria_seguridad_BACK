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



router.post('/createImageMessage', (req, res) => {
  const imageData = req.body; // imageData contendrá los datos binarios de la imagen
  
  // Directorio donde se guardarán las imágenes
  const directory = path.join(__dirname, 'assets', 'chatImage');

  // Nombre del archivo de imagen (puedes generar un nombre único si lo deseas)
  const filename = 'nina.jpg';

  // Ruta completa del archivo de imagen
  const filePath = path.join(directory, filename);

  // Escribe los datos binarios en el archivo de imagen
  fs.writeFile(filePath, imageData, 'binary', (err) => {
    if (err) {
      console.error('Error al guardar la imagen:', err);
      return res.status(500).json({ message: 'Error al guardar la imagen' });
    }

    console.log('Imagen guardada exitosamente:', filename);
    res.status(200).json({ message: 'Imagen guardada exitosamente', filename: filename });
  });
});


router.put(
  '/:id',
  [validateJWT, check('text').not().isEmpty(), validateFields],
  controller.updateMessage,
);

router.delete('/:id', [validateJWT, validateFields], controller.deleteMessage);

module.exports = router;
