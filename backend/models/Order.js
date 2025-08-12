const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // 訂單編號
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // 訂單明細 (關聯到 OrderItem)
  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem',
    required: true
  }],
  
  // 訂購人資訊
  sender: {
    // 訂購人姓名
    name: {
      type: String,
      required: [true, '訂購人姓名為必填'],
      trim: true
    },
    
    // 訂購人電話
    phone: {
      type: String,
      required: [true, '訂購人電話為必填'],
      trim: true
    },
    
    // 訂購人地址
    address: {
      type: String,
      required: [true, '訂購人地址為必填'],
      trim: true
    }
  },
  
  // 收件人資訊
  receiver: {
    // 收件人姓名
    name: {
      type: String,
      required: [true, '收件人姓名為必填'],
      trim: true
    },
    
    // 收件人電話
    phone: {
      type: String,
      required: [true, '收件人電話為必填'],
      trim: true
    },
    
    // 收件人地址
    address: {
      type: String,
      required: [true, '收件人地址為必填'],
      trim: true
    }
  },
  
  // 訂單總額 (不含運費)
  subtotal: {
    type: Number,
    required: [true, '訂單小計為必填'],
    min: [0, '金額不能為負數']
  },
  
  // 運費 (固定100元)
  shippingFee: {
    type: Number,
    default: 100
  },
  
  // 訂單總額 (含運費)
  totalAmount: {
    type: Number,
    required: [true, '訂單總額為必填'],
    min: [0, '總額不能為負數']
  },
  
  // 備註
  notes: {
    type: String,
    maxlength: [500, '備註不能超過500個字元'],
    default: ''
  },
  
  // 訂單狀態
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true // 自動產生 createdAt 和 updatedAt
});

// 建立索引
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;