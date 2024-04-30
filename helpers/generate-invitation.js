const { Invitation, Event } = require('../models');
const {
  transporter: { mailer },
} = require('../config/mails');

const sendMailAsync = (mailOptions) => {
  return new Promise(async (resolve, reject) => {
    try {
      mailer.sendMail(mailOptions, async (err) => {
        if (!err) {
          try {
            resolve({ msg: 'ok' });
          } catch (error) {
            reject(error);
          }
        } else {
          console.error(err);
          reject({
            msg: `Error - ${err.message}`,
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { sendMailAsync };
