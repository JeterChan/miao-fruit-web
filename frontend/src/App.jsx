import React, { useState, useEffect } from 'react';
import HeaderNavigation from './components/common/HeaderNavigation';
import Footer from './components/common/Footer';
import ProductList from './components/product/ProductList';
import Cart from './components/cart/Cart';
import OrderSuccess from './components/order/OrderSuccess';
import { api } from './services/api';
import useCart from './hooks/useCart';
import { initializeLiff, sendTextMessage } from './utils/liff';

const App = () => {
  const [products, setProducts] = useState({ singleLayer: [], doubleLayer: [] });
  const [carouselImages] = useState([
    {
      id: 1,
      title: '雙粒裝精美包裝',
      description: '特選雙粒裝，口感絕佳',
      type: 'real-photo',
      filename: 'two-piece.jpg'
    },
    {
      id: 2,
      title: '雙粒裝禮盒',
      description: '精美雙粒裝包裝',
      type: 'real-photo',
      filename: 'two-piece-box.jpg'
    },
    {
      id: 3,
      title: '5粒裝禮盒',
      description: '家庭分享裝，香甜多汁',
      type: 'real-photo',
      filename: 'five-piece.jpg'
    },
    {
      id: 4,
      title: '6粒裝禮盒',
      description: '適合送禮的精美包裝',
      type: 'real-photo',
      filename: 'six-piece.jpg'
    },
    {
      id: 5,
      title: '7粒裝禮盒',
      description: '大家庭分享裝',
      type: 'real-photo',
      filename: 'seven-piece.jpg'
    },
    {
      id: 6,
      title: '單層禮盒包裝',
      description: '卓蘭特產高接梨，精選品質',
      type: 'real-photo',
      filename: 'single-box.jpg'
    },
    {
      id: 7,
      title: '雙層禮盒包裝',
      description: '精美雙層裝',
      type: 'real-photo',
      filename: 'double-box.jpg'
    },
    {
      id: 8,
      title: '外觀包裝展示',
      description: '精美包裝設計',
      type: 'real-photo',
      filename: 'outfit.jpg'
    }
  ]);
  const [activeTab, setActiveTab] = useState('products');
  const [productTab, setProductTab] = useState('single'); // 新增產品類別狀態
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [liffInitialized, setLiffInitialized] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  const {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const liffResult = await initializeLiff();
        
        if (liffResult.success) {
          setLiffInitialized(true);
          if (liffResult.isLoggedIn && liffResult.profile) {
            setUserProfile(liffResult.profile);
            console.log('User profile:', liffResult.profile);
          }
        } else {
          console.error('LIFF initialization failed:', liffResult.error);
        }

        const productsData = await api.getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('載入數據失敗:', error);
      }
    };

    initializeApp();
  }, []);

  const submitOrder = async (orderData) => {
    setIsSubmitting(true);
    try {
      const result = await api.submitOrder(orderData, cart);
      if (result.status === 'success') {
        // 準備訂單成功頁面的數據
        const successData = {
          orderNumber: result.data.orderNumber,
          senderName: orderData.senderName,
          senderPhone: orderData.senderPhone,
          senderAddress: orderData.senderAddress,
          receiverName: orderData.receiverName,
          receiverPhone: orderData.receiverPhone,
          receiverAddress: orderData.receiverAddress,
          notes: orderData.notes,
          items: cart.map(item => ({
            grade: item.grade,
            quantity: item.cartQuantity,
            price: item.price
          }))
        };
        
        setOrderSuccess(successData);
        clearCart();
        setActiveTab('order-success');

        // Send order confirmation message via LINE
        if (liffInitialized && userProfile) {
          const orderMessage = `🍐 妙媽媽果園訂單確認

訂單編號：${result.data.orderNumber}
收件人：${orderData.receiverName}
聯絡電話：${orderData.receiverPhone}
收件地址：${orderData.receiverAddress}

訂購商品：
${cart.map(item => `• ${item.grade} x ${item.cartQuantity}盒`).join('\n')}

感謝您的訂購！我們會盡快為您處理訂單。`;
          
          await sendTextMessage(orderMessage);
        }
      }
    } catch (error) {
      console.log(error);
      alert('訂單提交失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToProducts = () => {
    setOrderSuccess(null);
    setActiveTab('products');
    setProductTab('single');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 合併的 Header 和 Navigation */}
      <HeaderNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.cartQuantity, 0)}
        productTab={productTab}
        setProductTab={setProductTab}
        userProfile={userProfile}
        liffInitialized={liffInitialized}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {activeTab === 'products' && (
          <ProductList
            products={products}
            carouselImages={carouselImages}
            onAddToCart={addToCart}
            productTab={productTab} // 傳遞當前選擇的產品類別
          />
        )}

        {activeTab === 'cart' && (
          <Cart
            cart={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemove={removeFromCart}
            onSubmitOrder={submitOrder}
            isSubmitting={isSubmitting}
            onBackToProducts={() => setActiveTab('products')}
          />
        )}

        {activeTab === 'order-success' && orderSuccess && (
          <OrderSuccess
            orderData={orderSuccess}
            onBackToProducts={handleBackToProducts}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;