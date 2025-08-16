const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// 產生唯一訂單編號
const generateOrderNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // 找出今天的最後一筆訂單
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
  const lastOrder = await Order.findOne({
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  }).sort({ createdAt: -1 });
  
  let sequence = 1;
  if (lastOrder && lastOrder.orderNumber) {
    const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
    sequence = lastSequence + 1;
  }
  
  // 格式: ORD20240315001
  return `ORD${year}${month}${day}${String(sequence).padStart(4, '0')}`;
};

// 提交訂單（從前端傳送的購物車資料建立訂單）
const submitOrder = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();
    // 從前端取得購物車資料和訂單資訊
    const {
      cartItems,
      ...orderData
    } = req.body;
    
    // 調試：印出收到的資料
    console.log('Received request body:', req.body);
    console.log('Cart items:', cartItems);
    console.log('Order data:', orderData);
    
    // 檢查購物車
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: '購物車是空的，無法建立訂單'
      });
    }
    
    // 從 orderData 取得客戶資訊
    const {
      senderName,
      senderPhone,
      senderAddress,
      receiverName,
      receiverPhone,
      receiverAddress,
      notes
    } = orderData;
    
    // 驗證必填欄位
    if (!senderName || !senderPhone || !senderAddress ||
        !receiverName || !receiverPhone || !receiverAddress) {
      return res.status(400).json({
        status: 'error',
        message: '請填寫所有必要欄位',
        debug: {
          senderName: !!senderName,
          senderPhone: !!senderPhone,
          senderAddress: !!senderAddress,
          receiverName: !!receiverName,
          receiverPhone: !!receiverPhone,
          receiverAddress: !!receiverAddress
        }
      });
    }
    
    // 產生訂單編號
    const orderNumber = await generateOrderNumber();
    
    // 建立訂單明細
    const orderItems = [];
    let subtotal = 0;
    let totalQuantity = 0;
    
    for (const cartItem of cartItems) {
      // 從資料庫取得最新產品資訊
      const product = await Product.findById(cartItem.id);
      
      if (!product) {
        return res.status(400).json({
          status: 'error',
          message: `產品 ${cartItem.grade} 已不存在`
        });
      }
      
      // 計算小計
      const itemSubtotal = product.price * cartItem.cartQuantity;
      
      // 建立訂單明細 (使用 session)
      const orderItem = await OrderItem.create([{
        orderNumber,
        product: cartItem.id,
        productName: product.grade,
        price: product.price,
        quantity: cartItem.cartQuantity,
        subtotal: itemSubtotal
      }], { session });
      
      orderItems.push(orderItem[0]._id);
      subtotal += itemSubtotal;
      totalQuantity += cartItem.cartQuantity;
    }
    
    // 運費計算：總數量2個以上免運費，否則收費100元
    const shippingFee = totalQuantity >= 2 ? 0 : 100;
    const totalAmount = subtotal + shippingFee;
    
    // 建立訂單 (使用 session)
    const order = await Order.create([{
      orderNumber,
      orderItems,
      sender: {
        name: senderName,
        phone: senderPhone,
        address: senderAddress
      },
      receiver: {
        name: receiverName,
        phone: receiverPhone,
        address: receiverAddress
      },
      subtotal,
      shippingFee,
      totalAmount,
      notes: notes || '',
      status: 'processing'
    }], { session });
    
    // 提交交易
    await session.commitTransaction();
    
    // 回傳訂單資訊
    res.status(201).json({
      status: 'success',
      message: '訂單建立成功！',
      data: {
        orderNumber: order[0].orderNumber,
        subtotal: order[0].subtotal,
        shippingFee: order[0].shippingFee,
        totalAmount: order[0].totalAmount,
        status: '處理中'
      }
    });
    
  } catch (error) {
    // 發生錯誤時回滾交易
    await session.abortTransaction();
    console.error('建立訂單錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '建立訂單時發生錯誤',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // 結束 session
    session.endSession();
  }
};

// 查詢訂單狀態（透過訂單編號和Email）
const getOrderStatus = async (req, res) => {
  try {
    const { orderNumber, email } = req.query;
    
    if (!orderNumber || !email) {
      return res.status(400).json({
        status: 'error',
        message: '請提供訂單編號和 Email'
      });
    }
    
    const order = await Order.findOne({ 
      orderNumber,
      'customer.email': email 
    });
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此訂單或Email不符'
      });
    }
    
    const statusText = {
      'pending': '處理中',
      'processing': '處理中',
      'shipped': '已出貨'
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        orderNumber: order.orderNumber,
        orderStatus: statusText[order.status] || order.status,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        totalAmount: order.totalAmount,
        orderDate: order.createdAt,
        customerName: order.customer.name,
        recipientName: order.recipient.name,
        recipientAddress: order.recipient.address
      }
    });
    
  } catch (error) {
    console.error('查詢訂單錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '查詢訂單時發生錯誤'
    });
  }
};

// 取得訂單詳細資訊
const getOrderDetails = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: '請提供 Email 進行驗證'
      });
    }
    
    const order = await Order.findOne({ 
      orderNumber,
      'customer.email': email 
    }).populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        select: 'name price description'
      }
    });
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此訂單或Email不符'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: order
    });
    
  } catch (error) {
    console.error('取得訂單詳情錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '無法取得訂單詳情'
    });
  }
};

// 管理員功能：取得所有訂單
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      startDate,
      endDate,
      sort = '-createdAt'
    } = req.query;
    
    // 建立查詢條件
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // 分頁
    const skip = (page - 1) * limit;
    
    // 查詢訂單
    const orders = await Order.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip(skip)
      .populate('orderItems');
    
    // 計算總數
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('取得訂單列表錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '取得訂單列表失敗'
    });
  }
};

// 管理員功能：更新訂單狀態
const updateOrderStatus = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: '請提供新狀態'
      });
    }
    
    // Convert Chinese status to English for database storage
    const statusMapping = {
      '處理中': 'processing',
      '已出貨': 'shipped',
      'pending': 'pending',
      'processing': 'processing',
      'shipped': 'shipped'
    };

    const validStatuses = ['pending', 'processing', 'shipped', '處理中', '已出貨'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: '無效的訂單狀態'
      });
    }

    // Use the mapped status for database update
    const dbStatus = statusMapping[status] || status;
    
    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { status: dbStatus },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: '找不到此訂單'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: '訂單狀態已更新',
      data: {
        orderNumber: order.orderNumber,
        newStatus: order.status
      }
    });
    
  } catch (error) {
    console.error('更新訂單狀態錯誤:', error);
    res.status(500).json({
      status: 'error',
      message: '更新訂單狀態失敗'
    });
  }
};

module.exports = {
  submitOrder,
  getOrderStatus,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus
};