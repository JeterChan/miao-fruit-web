import React, { useState, useEffect } from 'react';
import HeaderNavigation from './components/common/HeaderNavigation';
import Footer from './components/common/Footer';
import ProductList from './components/product/ProductList';
import Cart from './components/cart/Cart';
import { api } from './services/api';
import useCart from './hooks/useCart';

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
  
  const {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await api.getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('載入產品數據失敗:', error);
      }
    };

    loadData();
  }, []);

  const submitOrder = async (orderData) => {
    setIsSubmitting(true);
    try {
      const result = await api.submitOrder(orderData, cart);
      if (result.status === 'success') {
        alert(`訂單提交成功！訂單編號：${result.data.orderNumber}`);
        clearCart();
        setActiveTab('products');
      }
    } catch (error) {
      console.log(error);
      alert('訂單提交失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 合併的 Header 和 Navigation */}
      <HeaderNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.cartQuantity, 0)}
        productTab={productTab}
        setProductTab={setProductTab}
      />
      
      <main className="container mx-auto px-4 py-8">
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
      </main>

      <Footer />
    </div>
  );
};

export default App;