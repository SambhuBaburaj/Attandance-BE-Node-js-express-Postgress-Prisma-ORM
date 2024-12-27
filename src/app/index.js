const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const CustomError = require('../utils/Error.js');
const errorMiddleware = require('../middlewares/error.middleware.js');

// initializing the express application
const app = express();

// middlewares
app.use(
  cors({
    origin: '*',
  })
);


app.use(morgan('dev'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// routes import
const routesV1 = require('../v1/routes/index.js');
const whatsappSerivice = require('../v1/controllers/whatsapp/whatsappSerivice.js');

// routes declaration
app.use('/api/v1', routesV1);

// health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Catalog Service is up and running',
  });
});



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

      const result = await whatsappSerivice.sendTemplate(
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


app.post('/api/send-message', async (req, res) => {
  try {
      const { phoneNumber, message } = req.body;
      
      // Validate phone number (basic validation)
      if (!phoneNumber || !phoneNumber.match(/^\d{10,}$/)) {
          return res.status(400).json({ error: 'Invalid phone number' });
      }

      // Add country code if not present
      const formattedNumber = phoneNumber.startsWith('+') ? 
          phoneNumber : `+91${phoneNumber}`; // Assuming Indian numbers

      const result = await whatsappSerivice.sendMessage(
          formattedNumber,
          message
      );

      res.json({ success: true, result });
  } catch (error) {
      res.status(500).json({ 
          success: false, 
          error: error.message 
      });
  }
});







// Not Found Handler
app.use((_req, res) => {
  const error = CustomError.notFound({
    message: 'Resource Not Found',
    errors: ['The requested resource does not exist'],
    hints: 'Please check the URL and try again',
  });

  res.status(error.status).json({ ...error, status: undefined });
});

// Global Error Handler
app.use(errorMiddleware);

// export the app
module.exports = app;
