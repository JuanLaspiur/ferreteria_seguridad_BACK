const express = require('express');
const cors = require('cors');
var morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const { Chat, Demand, User, Message } = require('./models');
const port = process.env.PORT || 8080;
const Routes = require('./routes/index');
const { conn } = require('./db/config');
const {sendMessageNotification} = require('./helpers/send-notifications') 


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
    console.log(JSON.stringify(newMessageRecieved))
    try {
      const { sender, chat, text, docs} = newMessageRecieved;
      const data = {
        chat,
        text,
        sender,
        docs,
    };

      const newMessage = new Message(data);
      // Guardar el nuevo mensaje en la base de datos
      await newMessage.save();
  
      // Actualizar el arreglo de mensajes del chat
      await Chat.findByIdAndUpdate(chat, { $push: { messages: newMessage._id } });
  
      // Obtener la lista de mensajes actualizada del chat
      const updatedChat = await Chat.findById(chat).populate('messages');

 // Determine the recipient opposite to the sender to send message notification
 if (sender === updatedChat.buyer) {
  sendMessageNotification(updatedChat.seller._id, 'Mensaje recivido ', text);
} else  {
  sendMessageNotification(updatedChat.buyer._id, 'Mensaje recivido ', text);
} 

  
      // Emitir un evento para indicar que se ha recibido un nuevo mensaje
      socket.emit('message received', 
      updatedChat.messages
      );
    } catch (error) {
      console.error('Error al crear y enviar el mensaje:', error);
    }
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