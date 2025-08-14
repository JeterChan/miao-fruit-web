const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const api = {
  getProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },


  submitOrder: async (orderData, cartItems) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...orderData,
          cartItems
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  },

  // LINE Messaging API methods
  sendMessageToUser: async (userId, message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/line/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: userId,
          message: message
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      return {
        success: true,
        message: 'Message sent to user successfully',
        data: result
      };
    } catch (error) {
      console.error('Failed to send message to user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  sendTextMessage: async (userId, text) => {
    return await api.sendMessageToUser(userId, {
      type: 'text',
      text: text
    });
  },

  sendFlexMessage: async (userId, altText, contents) => {
    return await api.sendMessageToUser(userId, {
      type: 'flex',
      altText: altText,
      contents: contents
    });
  },

  sendImageMessage: async (userId, originalContentUrl, previewImageUrl) => {
    return await api.sendMessageToUser(userId, {
      type: 'image',
      originalContentUrl: originalContentUrl,
      previewImageUrl: previewImageUrl || originalContentUrl
    });
  },

  sendLocationMessage: async (userId, title, address, latitude, longitude) => {
    return await api.sendMessageToUser(userId, {
      type: 'location',
      title: title,
      address: address,
      latitude: latitude,
      longitude: longitude
    });
  }
};