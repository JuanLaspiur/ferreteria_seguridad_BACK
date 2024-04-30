const { Router } = require('express');
const { createOrderMERCADOPAGO } = require('../controllers/mercadopago.controller');

const router = Router();

router.post('/',
createOrderMERCADOPAGO,
);