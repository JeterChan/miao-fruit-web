const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

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

  getCarouselImages: async () => {
    return [
      {
        id: 1,
        title: '5粒裝精美包裝',
        description: '單層禮盒裝，精選優質水梨',
        type: 'real-photo',
        filename: 'image-1.jpg'
      },
      {
        id: 2,
        title: '6粒裝禮盒',
        description: '適合送禮的精美包裝',
        type: 'real-photo',
        filename: 'image-2.jpg'
      },
      {
        id: 3,
        title: '7粒裝禮盒',
        description: '家庭分享裝，香甜多汁',
        type: 'real-photo',
        filename: 'image-3.jpg'
      },
      {
        id: 4,
        title: '單層禮盒包裝',
        description: '卓蘭特產高接梨，精選品質',
        type: 'real-photo',
        filename: 'image-4.jpg'
      },
      {
        id: 5,
        title: '雙層禮盒包裝',
        description: '梨 Pear Fruit，精美雙層裝',
        type: 'real-photo',
        filename: 'image-5.jpg'
      }
    ];
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