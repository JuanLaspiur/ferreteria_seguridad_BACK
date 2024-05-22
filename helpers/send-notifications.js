const { User } = require('../models');
require('dotenv').config();

async function sendPushNotification(expoPushToken, title, body) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: { someData: "goes here" },
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    // Manejar la respuesta si es necesario
    console.log("Response:", response);
  } catch (error) {
    // Manejar el error si ocurre
    console.error("Error sending push notification:", error);
  }
}

async function sendDemandNotification(location) {
  try {
    // Obtén la lista de usuarios vendedores dentro de un radio de 15 km de la ubicación
    const sellers = await User.find({
      role: 'SELLER_ROLE', // Filtra solo a los vendedores
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(location.coordinates[1]), parseFloat(location.coordinates[0])], // Revisa el orden de las coordenadas si es necesario
          },
          $maxDistance: process.env.SEARCH_RADIUS || 15000, // 15 km en metros
        },
      },
    });

    // Envía notificaciones a cada vendedor encontrado
    sellers.forEach(async (seller) => {
      await sendPushNotification(seller.expoPushToken, 'Demanda cerca tuyo', 'Un usuario cerca tuyo pide un presupuesto de productos');
    });

    console.log('Notificaciones enviadas con éxito a los vendedores cercanos.');
  } catch (error) {
    console.error('Error al enviar las notificaciones:', error);
  }
}


async function sendMessageNotification(recipientId, title, body) {
  try {
    const recipient = await User.findById(recipientId);
    if (!recipient || !recipient.expoPushToken) {
      console.error('Usuario no encontrado o expoPushToken no disponible');
      return;
    }

    // Envía la notificación push al expoPushToken del destinatario
    await sendPushNotification(recipient.expoPushToken, title, body);
  } catch (error) {
    console.error('Error al enviar la notificación push:', error);
  }
}


module.exports = {
  sendPushNotification,
  sendDemandNotification,
  sendMessageNotification
};
