const express = require('express');
const axios = require('axios');
const router = express.Router();

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

if (!LINE_CHANNEL_ACCESS_TOKEN) {
  console.error('Warning: LINE_CHANNEL_ACCESS_TOKEN not found in environment variables');
}

// Send push message to specific user
router.post('/send-message', async (req, res) => {
  try {
    const { userId, message } = req.body;

    // Validate request
    if (!userId || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'userId and message are required' 
      });
    }

    if (!message.type) {
      return res.status(400).json({ 
        success: false,
        error: 'message must have a type field' 
      });
    }

    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      return res.status(500).json({ 
        success: false,
        error: 'LINE Channel Access Token not configured' 
      });
    }

    // LINE Messaging API endpoint
    const lineApiUrl = 'https://api.line.me/v2/bot/message/push';
    
    const payload = {
      to: userId,
      messages: [message]
    };

    // Send message via LINE Messaging API
    const response = await axios.post(lineApiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Message sent successfully to user ${userId}`);
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully',
      lineResponse: response.status
    });

  } catch (error) {
    console.error('LINE API Error:', error.response?.data || error.message);
    
    // Handle specific LINE API errors
    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request to LINE API',
        details: error.response.data
      });
    } else if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        error: 'Invalid LINE Channel Access Token'
      });
    } else if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Check user permissions or channel settings'
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Failed to send message', 
      details: error.response?.data || error.message 
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    hasAccessToken: !!LINE_CHANNEL_ACCESS_TOKEN,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;