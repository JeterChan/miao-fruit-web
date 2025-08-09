import React, { useState, useEffect } from 'react';
import HeaderNavigation from './components/common/HeaderNavigation';
import Footer from './components/common/Footer';
import ProductList from './components/product/ProductList';
import Cart from './components/cart/Cart';
import { mockAPI } from './services/api';
import useCart from './hooks/useCart';

const App = () => {
  const [products, setProducts] = useState({ singleLayer: [], doubleLayer: [] });
  const [carouselImages, setCarouselImages] = useState([]);
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
        const [productsData, imagesData] = await Promise.all([
          mockAPI.getProducts(),
          mockAPI.getCarouselImages()
        ]);
        setProducts(productsData);
        setCarouselImages(imagesData);
      } catch (error) {
        console.error('載入數據失敗:', error);
      }
    };

    loadData();
  }, []);

  const submitOrder = async (orderData) => {
    setIsSubmitting(true);
    try {
      const result = await mockAPI.submitOrder(orderData);
      if (result.success) {
        alert(`訂單提交成功！訂單編號：${result.orderId}`);
        clearCart();
        setActiveTab('products');
      }
    } catch (error) {
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