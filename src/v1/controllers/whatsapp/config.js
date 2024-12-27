require('dotenv').config();

const config = {
  whatsappToken: process.env.WHATSAPP_TOKEN,
  phoneNumberId: process.env.PHONE_NUMBER_ID,
  version: 'v17.0',
};

module.exports = config;
