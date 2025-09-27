let modelsInstance = null;

const initializeModels = (mongoose) => {
  if (modelsInstance) {
    console.warn('Models already initialized');
    return modelsInstance;
  }

  try {
    // 篩選order-system需要的models
      modelsInstance = {
      Product: require('./Product')(mongoose),
      Order: require('./Order')(mongoose),
      OrderItem: require('./OrderItem')(mongoose),
      Admin: require('./Admin')(mongoose)
  };

    console.log('✅ Models initialized');
    return modelsInstance;
  } catch (error) {
    console.error('❌ Error initializing models:', error);
    console.error('Stack:', error.stack);
    throw error;
  } 
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