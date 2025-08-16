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
  },

  // Admin API methods
  admin: {
    // Get admin headers
    getAdminHeaders: () => {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add admin authentication
      const adminKey = process.env.REACT_APP_ADMIN_API_KEY;
      headers['x-admin-key'] = adminKey;
      
      return headers;
    },

    // Get all orders with optional filtering and pagination
    getAllOrders: async (filters = {}) => {
      try {
        const queryParams = new URLSearchParams();
        
        // Add pagination parameters
        queryParams.append('page', filters.page || 1);
        queryParams.append('limit', filters.limit || 10);
        
        // Add optional filter parameters
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.sort) queryParams.append('sort', filters.sort);

        const response = await fetch(`${API_BASE_URL}/orders/admin/all?${queryParams}`, {
          method: 'GET',
          headers: api.admin.getAdminHeaders(),
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('需要管理員權限才能存取此資源');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching admin orders:', error);
        throw error;
      }
    },

    // Update order status
    updateOrderStatus: async (orderNumber, status) => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/admin/${orderNumber}/status`, {
          method: 'PUT',
          headers: api.admin.getAdminHeaders(),
          credentials: 'include',
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('需要管理員權限才能存取此資源');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
    },

    // Get order details (for admin, doesn't require email verification)
    getOrderDetails: async (orderNumber) => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/admin/${orderNumber}`, {
          method: 'GET',
          headers: api.admin.getAdminHeaders(),
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('需要管理員權限才能存取此資源');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
      }
    }
  }
};