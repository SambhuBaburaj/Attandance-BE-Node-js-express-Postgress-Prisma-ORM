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

