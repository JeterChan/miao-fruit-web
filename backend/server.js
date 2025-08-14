const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();

// 建立 Express 應用
const app = express();

// 連接 MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB 連接成功'))
.catch((err) => console.error('❌ MongoDB 連接失敗:', err));

// 中間件設定
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session 設定（用於儲存購物車，過期時間 1 小時）
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 小時（毫秒）
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  },
  name: 'fruit.sid' // session cookie 名稱
}));


// 引入路由
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const lineRoutes = require('./routes/line');

// 使用路由
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/line', lineRoutes);

// 健康檢查端點
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '伺服器運行正常',
    sessionID: req.sessionID,
    timestamp: new Date().toISOString()
  });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: '找不到請求的資源'
  });
});

// 全域錯誤處理
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || '伺服器內部錯誤';
  
  console.error('Error:', err);
  
  res.status(status).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 啟動伺服器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 伺服器運行在 port ${PORT}`);
  console.log(`📍 環境: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS 允許來源: ${process.env.CLIENT_URL}`);
  console.log(`⏰ Session 過期時間: 1 小時`);
});