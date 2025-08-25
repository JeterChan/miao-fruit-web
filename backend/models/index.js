const createModels = require('../shared/models');

let modelsInstance = null;

const initializeModels = (mongoose) => {
  if (modelsInstance) {
    console.warn('Models already initialized');
    return modelsInstance;
  }

  const dbModels = createModels(mongoose);

  // 篩選order-system需要的models
  modelsInstance = {
    Product: dbModels.Product,
    Order: dbModels.Order,
    OrderItem: dbModels.OrderItem
  };

  console.log('✅ Models initialized');
  return modelsInstance;
};

const getModels = () => {
  if (!modelsInstance) {
    throw new Error('Models not initialized. Make sure to call initializeModels() in your app startup.');
  }
  return modelsInstance;
};


module.exports = {
  initializeModels,
  getModels
};