import { CheckCircle, Package, Phone, ArrowLeft, User, MapPin, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

const OrderSuccess = ({ orderData, onBackToProducts }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const totalAmount = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Show/hide floating scroll button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowFloatingButton(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="max-w-2xl mx-auto animate-slideInFromBottom">
      {/* 成功標題 */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">詢價單提交成功！</h1>
        <p className="text-gray-600">感謝您的詢價，我們會儘快為您處理</p>
      </div>

      {/* 訂單詳情卡片 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5" />
            詢價單詳情
          </h2>
        </div>

        {/* 訂單編號 */}
        <div className="mb-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">詢價單編號</span>
              <span className="text-lg font-bold text-orange-600">{orderData.orderNumber}</span>
            </div>
          </div>
        </div>

        {/* 寄件人資訊 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            寄件人資訊
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">姓名：</span>
                <span className="font-medium">{orderData.senderName}</span>
              </div>
              <div>
                <span className="text-gray-600">電話：</span>
                <span className="font-medium">{orderData.senderPhone}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600">地址：</span>
                <span className="font-medium">{orderData.senderAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 收件人資訊 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            收件人資訊
          </h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">姓名：</span>
                <span className="font-medium">{orderData.receiverName}</span>
              </div>
              <div>
                <span className="text-gray-600">電話：</span>
                <span className="font-medium">{orderData.receiverPhone}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600">地址：</span>
                <span className="font-medium">{orderData.receiverAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 備註 */}
        {orderData.notes && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">備註</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <span className="text-gray-700">{orderData.notes}</span>
            </div>
          </div>
        )}

        {/* 訂單商品 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">訂購商品</h3>
          <div className="space-y-3">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{item.grade}</span>
                  <span className="text-gray-600 ml-2">x{item.quantity}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                  <div className="text-sm text-gray-500">單價 {formatPrice(item.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 總金額 */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">總金額</span>
            <span className="text-2xl font-bold text-orange-600">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* 聯絡資訊 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Phone className="w-5 h-5" />
          後續聯絡
        </h3>
        <p className="text-gray-700">
          如有任何問題，請撥打：<span className="font-bold text-blue-600">0910-567118</span>
        </p>
      </div>

      {/* 動作按鈕 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
          回到頂部
        </button>
        <button
          onClick={onBackToProducts}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          繼續選購
        </button>
      </div>

      {/* 浮動回到頂部按鈕 */}
      {showFloatingButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50 animate-slideInFromBottom"
          aria-label="回到頂部"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default OrderSuccess;