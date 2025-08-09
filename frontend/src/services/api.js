export const mockAPI = {
  getProducts: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      singleLayer: [
        { id: '16A', grade: '16A', quantity: 9, price: 700 },
        { id: '18A', grade: '18A', quantity: 8, price: 700 },
        { id: '20A', grade: '20A', quantity: 7, price: 800 },
        { id: '22A', grade: '22A', quantity: 6, price: 900 },
        { id: '24A', grade: '24A', quantity: 6, price: 1000 },
        { id: '26A', grade: '26A', quantity: 5, price: 1000 },
        { id: '28A', grade: '28A', quantity: 5, price: 1100 },
        { id: '30A', grade: '30A', quantity: 5, price: 1200 },
        { id: '32A', grade: '32A', quantity: 5, price: 1300 },
        { id: '34A-5', grade: '34A', quantity: 5, price: 1400 },
        { id: '36A-5', grade: '36A', quantity: 5, price: 1500 },
        { id: '38A', grade: '38A', quantity: 4, price: 1500 },
      ],
      doubleLayer: [
        { id: '34A-2', grade: '34A', quantity: 2, price: 500 },
        { id: '36A-2', grade: '36A', quantity: 2, price: 600 },
        { id: '38A-2', grade: '38A', quantity: 2, price: 700 },
        { id: '40A', grade: '40A', quantity: 2, price: 800 },
      ]
    };
  },

  getCarouselImages: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
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

  submitOrder: async (orderData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('訂單提交:', orderData);
    return { 
      success: true, 
      orderId: 'ORD' + Date.now(),
      message: '訂單提交成功'
    };
  }
};