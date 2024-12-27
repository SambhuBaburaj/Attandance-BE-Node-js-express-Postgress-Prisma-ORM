// First install required packages:
// npm install express dotenv axios

// config.js
require('dotenv').config();

const config = {
    whatsappToken: process.env.WHATSAPP_TOKEN,
    phoneNumberId: process.env.PHONE_NUMBER_ID,
    version: 'v17.0'
};

module.exports = config;

// whatsappService.js
const axios = require('axios');
const config = require('./config');

class WhatsAppService {
    constructor() {
        this.baseUrl = `https://graph.facebook.com/${config.version}/${config.phoneNumberId}`;
        this.headers = {
            'Authorization': `Bearer ${config.whatsappToken}`,
            'Content-Type': 'application/json'
        };
    }

    async sendMessage(phoneNumber, message) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: phoneNumber,
                    type: 'text',
                    text: { 
                        body: message 
                    }
                },
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('WhatsApp API Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async sendTemplate(phoneNumber, templateName, components = []) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: phoneNumber,
                    type: 'template',
                    template: {
                        name: templateName,
                        language: {
                            code: 'en'
                        },
                        components: components
                    }
                },
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('WhatsApp API Error:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = new WhatsAppService();


// Route to send a simple text message


// Route to send a template message (like BookMyShow notifications)
app.post('/api/send-booking-confirmation', async (req, res) => {
    try {
        const { phoneNumber, bookingDetails } = req.body;
        
        const components = [
            {
                type: 'body',
                parameters: [
                    {
                        type: 'text',
                        text: bookingDetails.movieName
                    },
                    {
                        type: 'text',
                        text: bookingDetails.date
                    },
                    {
                        type: 'text',
                        text: bookingDetails.time
                    },
                    {
                        type: 'text',
                        text: bookingDetails.seats
                    }
                ]
            }
        ];

        const result = await whatsappService.sendTemplate(
            phoneNumber,
            'booking_confirmation',
            components
        );

        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

