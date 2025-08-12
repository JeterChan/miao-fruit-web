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
  }
};