const { Router } = require('express');
const { mercadopago : controller } = require('../controllers');

const router = Router();

router.post('/',
controller.createOrderMERCADOPAGO,
);