module.exports = (mongoose) => {
  // 防止重複註冊同一個 model
  if (mongoose.models.OrderItem) {
    return mongoose.models.OrderItem;
  }

  const orderItemSchema = new mongoose.Schema({
    // 關聯的訂單編號
    orderNumber: {
      type: String,
      required: [true, '訂單編號為必填']
    },
    
    // 關聯的產品
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, '產品為必填']
    },
    
    // 產品名稱 (快照，避免產品資料變更影響歷史訂單)
    productName: {
      type: String,
      required: [true, '產品名稱為必填']
    },
    
    // 訂購時的單價 (快照)
    price: {
      type: Number,
      required: [true, '產品單價為必填'],
      min: [0, '價格不能為負數']
    },
    
    // 訂購數量
    quantity: {
      type: Number,
      required: [true, '訂購數量為必填'],
      min: [1, '數量至少為1']
    },
    
    // 小計金額 (單價 x 數量)
    subtotal: {
      type: Number,
      required: [true, '小計金額為必填'],
      min: [0, '小計不能為負數']
    }
  }, {
    timestamps: true
  });

  // 建立索引
  orderItemSchema.index({ orderNumber: 1 });
  orderItemSchema.index({ product: 1 });

  return mongoose.model('OrderItem', orderItemSchema);
};