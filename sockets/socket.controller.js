const { Chat, Message, Demand } = require('../models');
const Server = require('../models/server');

const socketController = () => {
  const io = require('socket.io')(Server, {
    pingTimeout: 60000,
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('Connected to socket.io');
    socket.on('setup', (userData) => {
      socket.join(userData.uid);
      socket.emit('connected');
    });

    socket.on('join chat', (room) => {
      socket.join(room);
      console.log('User Joined Room: ' + room);
    });
    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', async (newMessageRecieved) => {
      var chatId = newMessageRecieved.chat;
      const chat = await Chat.findById(chatId);

      if (!chat.users) return console.log('chat.users not defined');

      if (newMessageRecieved == chat.seller) {
        socket.in(chat.buyer).emit('message recieved', newMessageRecieved);
      } else {
        socket.in(chat.seller).emit('message recieved', newMessageRecieved);
      }
    });
    socket.on('new demand', async (newDemandRecieved) => {
      //find users with role USER_ROLE
      const users = await User.find({ role: 'USER_ROLE' });

      users.forEach((user) => {
        socket.in(user._id).emit('new demand recieved', newDemandRecieved);
      });
    });

    socket.on('new offer', async (newOffer) => {
      var demandId = newOffer.demand;
      const demand = await Demand.findById(demandId);
      const user = demand.user;
      socket.in(user).emit('new offer recieved', newOffer);
    });

    socket.on('offer acepted', async (Offer) => {
      var seller = Offer.seller;
      socket.in(seller).emit('offer acepted recieved', newOffer);
    });

    socket.off('setup', () => {
      console.log('USER DISCONNECTED');
      socket.leave(userData._id);
    });
  });
};

module.exports = {
  socketController,
};
