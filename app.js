const express = require('express');
const cors = require('cors');
var morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const { Chat, Demand, User } = require('./models');


const port = process.env.PORT || 8080;
const Routes = require('./routes/index');
const { conn } = require('./db/config');

conn();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.use('/api', Routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const servidor = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const { Server } = require('socket.io');

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
console.log('Conectado juancito ')
});
