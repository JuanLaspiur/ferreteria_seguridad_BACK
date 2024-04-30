const router = require('express').Router();

const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const categoriesRoute = require('./categories.route');
const productsRoute = require('./products.route');
const searchRoute = require('./search.route');
const uploadsRoute = require('./uploads.route');
const demandRoute = require('./demand.route');
const offerRoute = require('./offer.route');
const orderRoute = require('./order.route');
const chatRoute = require('./chat.route');
const messageRoute = require('./message.route');
const mpagoRoute = require('./mpago.route');

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/categories', categoriesRoute);
router.use('/products', productsRoute);
router.use('/search', searchRoute);
router.use('/uploads', uploadsRoute);
router.use('/demands', demandRoute);
router.use('/offers', offerRoute);
router.use('/orders', orderRoute);
router.use('/chats', chatRoute);
router.use('/messages', messageRoute);
router.use('/mpago', mpagoRoute);

module.exports = router;

