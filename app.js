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
  console.log('Connected to socket.io');
  socket.on('setup', (userData) => {
 // console.log(userData);
  //  socket.join(userData.uid);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
  });
  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', async (newMessageRecieved) => {
    //console.log(newMessageRecieved);
    var chatId = newMessageRecieved.chat;
    // var sender = newMessageRecieved.sender;
    // const chat = await Chat.findById(chatId);
    //console.log(chat);

    // if (sender == chat.seller) {
    //   socket.in(chat.buyer).emit('message recieved', newMessageRecieved);
    // } else {
    //   socket.in(chat.seller).emit('message recieved', newMessageRecieved);
    // }
    socket.to(chatId).emit('message recieved', newMessageRecieved);
  });
  socket.on('new demand', async (newDemandRecieved) => {
    const sellers = await User.find({ role: 'SELLER_ROLE' });
    // sellers.forEach((user) => {
    //   socket.in(user._id).emit('new demand recieved', newDemandRecieved);
    // });
    socket.to('demandas').emit('new demand recieved', newDemandRecieved);
  });

  socket.on('new offer', async (newOffer) => {
    var demandId = newOffer.demand;
    const demand = await Demand.findById(demandId);
    const user = demand.user;
    //socket.in(user).emit('new offer recieved', newOffer);
    socket.to(demandId).emit('new offer recieved', newOffer);
  });

  socket.on('new order', async (newOrder) => {
    var seller = newOrder.seller;
    socket.in(seller).emit('new order recieved', newOffer);
  });

  socket.off('setup', () => {
    //console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});