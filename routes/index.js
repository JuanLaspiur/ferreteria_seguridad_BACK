const route = require('express').Router();

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
const mpago = require('./mpago.route');

route.use('/auth', authRoute);
route.use('/users', userRoute);
route.use('/categories', categoriesRoute);
route.use('/products', productsRoute);
route.use('/search', searchRoute);
route.use('/uploads', uploadsRoute);
route.use('/demands', demandRoute);
route.use('/offers', offerRoute);
route.use('/orders', orderRoute);
route.use('/chats', chatRoute);
route.use('/messages', messageRoute);
route.use('/mpago', mpago);

module.exports = route;
