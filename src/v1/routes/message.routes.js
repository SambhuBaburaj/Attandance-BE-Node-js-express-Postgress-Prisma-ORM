
const router = require('express').Router();

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



module.exports = router;
