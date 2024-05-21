const { Expo } = require('expo-server-sdk');

// Crea una instancia de Expo
const expo = new Expo();

// Función para generar un token de notificación push de Expo
async function generateExpoPushToken() {
  try {
    // Genera un nuevo token de notificación push
    const expoPushToken = await expo.getDevicePushTokenAsync({
      deviceId: Expo.random.getPushToken(),
    });

    return expoPushToken.data; // Devuelve el nuevo token generado
  } catch (error) {
    console.error('Error generating Expo Push Token:', error);
    throw error;
  }
}
function isValidExpoPushToken(token) {
    // Basic validation: check if the token is a non-empty string
    return typeof token === 'string' && token.trim() !== '';
  }

module.exports = {
  generateExpoPushToken,
  isValidExpoPushToken
};
