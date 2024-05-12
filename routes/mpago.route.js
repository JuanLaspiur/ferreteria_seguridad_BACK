const { Router } = require('express');
const { createOrderMERCADOPAGO, webHook } = require('../controllers/mercadopago.controller');

const router = Router();

router.post('/',
createOrderMERCADOPAGO,
);

router.post('/webHook',
webHook
)
module.exports = router;
