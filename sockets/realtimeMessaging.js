// Crear una instancia de Socket.io localmente
const { Server } = require("socket.io");

// Crear el servidor de Socket.io
const io = new Server();

// Función para enviar un mensaje en tiempo real a un chat específico
const sendRealTimeMessage = async (chatId, message) => {
  // Envía el mensaje a través de Socket.io a todos los clientes conectados al chat
  io.to(chatId).emit("newMessage", message);
};

module.exports = {
  sendRealTimeMessage,
};
