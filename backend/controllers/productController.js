const { getModels } = require('../models');

// 取得所有產品
const getAllProducts = async (req, res) => {
  try {
    const { Product } = getModels();
    const products = await Product.find({});
    // 分離單層和雙層產品
    const singleLayer = [];
    const doubleLayer = [];
    
    products.forEach(product => {
      const productData = {
        id: product.id,
        grade: product.grade,
        quantity: product.quantity,
        price: product.price,
        catelog: product.catelog
      };
      
      // 根據 grade 中的 id 格式判斷是單層還是雙層
      // 如果 grade 包含 "-2" (如 "38A-2")，則為雙層
      if (product.catelog && product.catelog === "double") {
        doubleLayer.push(productData);
      } else {
        singleLayer.push(productData);
      }
    });

    // 按照價格排序（由低到高）
    const sortByPrice = (a, b) => a.price - b.price;

    singleLayer.sort(sortByPrice);
    doubleLayer.sort(sortByPrice);
    
    res.status(200).json({
      singleLayer,
      doubleLayer
    });
    
  } catch (error) {
    console.error('取得產品列表錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '無法取得產品列表'
    });
  }
};

// 取得單一產品
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id)
      .select('_id grade price quantity');
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: '找不到該產品'
      });
    }
    
    const productData = {
      id: product._id.toString(),
      grade: product.grade,
      quantity: product.quantity,
      price: product.price
    };
    
    res.status(200).json({
      status: 'success',
      data: productData
    });
    
  } catch (error) {
    console.error('取得產品錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '無法取得產品資訊'
    });
  }
};

module.exports = {
  getAllProducts,
  getProduct
};