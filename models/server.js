require('dotenv').config();

const express = require('express');
const cors = require('express');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { conn } = require('../db/config');
const { socketController } = require('../sockets/socket.controller');

class Server {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = require('socket.io')(this.server);

    this.paths = {
      auth: '/api/auth',
      categories: '/api/categories',
      users: '/api/users',
      products: '/api/products',
      search: '/api/search',
      uploads: '/api/uploads',
      demand: '/api/demands',
      offer: '/api/offers',
      order: '/api/orders',
      chat: '/api/chats',
      message: '/api/messages',
    };

    //Conectar DB
    this.dbConn();

    // Middlewares
    this.middlewares();

    // Rutas de mi app
    this.routes();

    // Sockets
    this.sockets();

    // Puerto
    this.port = process.env.PORT || 8080;
  }

  async dbConn() {
    await conn();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static('public'));

    // Fileupload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      }),
    );
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth.route'));
    this.app.use(this.paths.users, require('../routes/user.route'));
    this.app.use(this.paths.categories, require('../routes/categories.route'));
    this.app.use(this.paths.products, require('../routes/products.route'));
    this.app.use(this.paths.search, require('../routes/search.route'));
    this.app.use(this.paths.uploads, require('../routes/uploads.route'));
    this.app.use(this.paths.demand, require('../routes/demand.route'));
    this.app.use(this.paths.offer, require('../routes/offer.route'));
    this.app.use(this.paths.order, require('../routes/order.route'));
    this.app.use(this.paths.chat, require('../routes/chat.route'));
    this.app.use(this.paths.message, require('../routes/message.route'));
    //app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  }

  sockets() {
    this.io.on('connection', socketController);
  }

  listen() {
    this.server.listen(this.port, () =>
      console.log(`Server listening on port: ${this.port}`),
    );
  }
}

module.exports = Server;
