const axios = require('axios');

async function generateExpoPushToken() {
  try {
    // Realiza una solicitud a la API de Expo para obtener el token de notificación push
    const response = await axios.post(`https://exp.host/--/api/v2/push/getExpoPushToken`, {
      experienceId: "97145856-a452-4a7b-bd0f-bfcfebbbaad0"
    });

    // Verifica si la respuesta es exitosa y obtén el token de notificación push
    if (response.data && response.data.data && response.data.data.expoPushToken) {
      const expoPushToken = response.data.data.expoPushToken;
      console.log('TOKEN GENERADO ' + JSON.stringify(expoPushToken));
      return expoPushToken;
    } else {
      throw new Error('No se pudo obtener el token de notificación push');
    }
  } catch (error) {
    console.error('Error generando el token de notificación push de Expo:', error);
    throw error;
  }
}

function isValidExpoPushToken(token) {
  // Realiza la validación del token de notificación push según tus requisitos
  return typeof token === 'string' && token.trim() !== '';
}

module.exports = {
  generateExpoPushToken,
  isValidExpoPushToken
};


