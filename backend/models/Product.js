const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // 產品名稱, 水梨等級
  grade: {
    type: String,
    required: [true, '產品名稱為必填'],
    trim: true,
    maxlength: [100, '產品名稱不能超過100個字元']
  },
  
  // 產品價格
  price: {
    type: Number,
    required: [true, '產品價格為必填'],
    min: [0, '價格不能為負數']
  },

  // 顆粒
  quantity: {
    type:Number,
    required:[true, '顆粒數量為必填']
  },

  // 產品類別 (single 或 double)
  catelog: {
    type: String,
    required: [true, '產品類別為必填'],
    enum: ['single', 'double'],
    default: 'single'
  }
}, {
  timestamps: true // 自動產生 createdAt 和 updatedAt
});

// 建立索引以提升查詢效能
productSchema.index({ name: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;