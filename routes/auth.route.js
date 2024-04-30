const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateJWT } = require('../middlewares');
const { auth } = require('../controllers');
const { userExist } = require('../helpers');

const uploadsFiles = require('../config/multerfiles');
const uploads = require('../config/multer');

//uploads.array('files', 8),

const cpUpload = uploadsFiles.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'files', maxCount: 5 },
]);

const router = Router();

router.post(
  '/login',
  [
    check('email', 'Email Obligatorio / Invalido').not().isEmpty().isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email').custom(userExist),
    validateFields,
  ],
  auth.login,
);

router.post(
  '/google',
  [
    check('id_token', 'id_token es obligatorio').not().isEmpty(),
    validateFields,
  ],
  auth.googleSignIn,
);

router.get('/profile', validateJWT, auth.profile);

router.put(
  '/profile',
  uploads.single('avatar', 8),
  validateJWT,
  auth.editProfile,
);

router.post('/changePassword', auth.changePassword);
router.post('/checkToken', auth.checkToken);
router.post('/newPassword', auth.newPassword);

module.exports = router;
