import React, { useState } from 'react';
import { ShoppingCart, Package, Phone, Menu, X } from 'lucide-react';

const HeaderNavigation = ({ activeTab, setActiveTab, cartCount, productTab, setProductTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // 關閉手機選單
  };

  const handleProductTabChange = (tab) => {
    setProductTab(tab);
    setActiveTab('products'); // 切換到產品頁面
    setIsMobileMenuOpen(false); // 關閉手機選單
  };

  return (
    <header className="bg-gradient-to-r from-orange-300 to-yellow-200 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* 桌面版 - 完整佈局 */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo 圖片區域 */}
            <a 
              href={process.env.NODE_ENV === 'development' ? process.env.REACT_APP_FRONTEND_URL : '/'}
              className="relative mr-4 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/images/logo-nobackground.png" 
                alt="妙媽媽果園" 
                className="w-16 h-16 rounded-full shadow-lg object-cover"
              />
            </a>
            
            {/* 品牌名稱和標語 */}
            <div>
              <a 
                href={process.env.NODE_ENV === 'development' ? process.env.REACT_APP_FRONTEND_URL : '/'}
                className="text-2xl font-bold text-gray-800 hover:text-orange-700 transition-colors"
              >
                妙媽媽果園
              </a>
              <p className="text-gray-600 text-sm">香甜可口好滋味・脆口多汁有夠讚</p>
            </div>
          </div>

          {/* 右側區域：導航和聯絡資訊 */}
          <div className="flex items-center gap-6">
            {/* 導航選單 */}
            <nav className="flex space-x-4">
              <button
                onClick={() => handleProductTabChange('single')}
                className={`py-2 px-4 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'products' && productTab === 'single'
                    ? 'border-orange-600 text-orange-800'
                    : 'border-transparent text-gray-700 hover:text-orange-700'
                }`}
              >
                <Package className="w-4 h-4" />
                單層系列
              </button>

              <button
                onClick={() => handleProductTabChange('double')}
                className={`py-2 px-4 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'products' && productTab === 'double'
                    ? 'border-orange-600 text-orange-800'
                    : 'border-transparent text-gray-700 hover:text-orange-700'
                }`}
              >
                <Package className="w-4 h-4" />
                雙粒裝系列
              </button>
              
              <button
                onClick={() => handleTabChange('cart')}
                className={`py-2 px-4 border-b-2 font-medium transition-colors flex items-center gap-2 relative ${
                  activeTab === 'cart'
                    ? 'border-orange-600 text-orange-800'
                    : 'border-transparent text-gray-700 hover:text-orange-700'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                購物車
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </nav>

            {/* 聯絡資訊 */}
            <div className="flex items-center gap-2 text-gray-700 border-l border-orange-300 pl-6">
              <Phone size={16} />
              <span className="text-sm font-medium">0910-567118</span>
            </div>
          </div>
        </div>

        {/* 平板版 - 簡化佈局 */}
        <div className="hidden sm:flex md:hidden items-center justify-between">
          <div className="flex items-center">
            {/* Logo */}
            <a 
              href={process.env.NODE_ENV === 'development' ? process.env.REACT_APP_FRONTEND_URL : '/'}
              className="relative mr-3 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/images/logo-nobackground.png" 
                alt="妙媽媽果園" 
                className="w-12 h-12 rounded-full shadow-lg object-cover"
              />
            </a>
            
            {/* 品牌名稱 */}
            <div>
              <a 
                href={process.env.NODE_ENV === 'development' ? process.env.REACT_APP_FRONTEND_URL : '/'}
                className="text-xl font-bold text-gray-800 hover:text-orange-700 transition-colors"
              >
                妙媽媽果園
              </a>
              <p className="text-gray-600 text-xs">香甜可口好滋味・脆口多汁有夠讚</p>
            </div>
          </div>

          {/* 右側：導航 + 電話 */}
          <div className="flex items-center gap-3">
            <nav className="flex space-x-2">
              <button
                onClick={() => handleProductTabChange('single')}
                className={`py-2 px-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'products' && productTab === 'single'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-700 hover:bg-orange-200'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="text-sm">單層</span>
              </button>

              <button
                onClick={() => handleProductTabChange('double')}
                className={`py-2 px-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'products' && productTab === 'double'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-700 hover:bg-orange-200'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="text-sm">雙粒</span>
              </button>
              
              <button
                onClick={() => handleTabChange('cart')}
                className={`py-2 px-3 rounded-lg font-medium transition-colors flex items-center gap-2 relative ${
                  activeTab === 'cart'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-700 hover:bg-orange-200'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm">購物車</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </nav>

            <div className="flex items-center gap-1 text-gray-700">
              <Phone size={14} />
              <span className="text-xs font-medium">0910-567118</span>
            </div>
          </div>
        </div>

        {/* 手機版 - 漢堡選單 */}
        <div className="flex sm:hidden items-center justify-between">
          <div className="flex items-center">
            {/* Logo */}
            <a 
              href={process.env.NODE_ENV === 'development' ? process.env.REACT_APP_FRONTEND_URL : '/'}
              className="relative mr-3 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/images/logo-nobackground.png" 
                alt="妙媽媽果園" 
                className="w-10 h-10 rounded-full shadow-lg object-cover"
              />
            </a>
            
            {/* 品牌名稱 */}
            <div>
              <a 
                href={process.env.NODE_ENV === 'development' ? process.env.REACT_APP_FRONTEND_URL : '/'}
                className="text-lg font-bold text-gray-800 hover:text-orange-700 transition-colors"
              >
                妙媽媽果園
              </a>
            </div>
          </div>

          {/* 右側：購物車計數 + 漢堡選單 */}
          <div className="flex items-center gap-3">
            {/* 購物車計數顯示 */}
            {cartCount > 0 && (
              <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full">
                <ShoppingCart size={14} />
                <span className="text-xs font-medium">{cartCount}</span>
              </div>
            )}

            {/* 漢堡選單按鈕 */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-orange-200 hover:bg-orange-300 transition-colors"
              aria-label="開啟選單"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* 手機版下拉選單 */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-4 bg-white rounded-lg shadow-lg border border-orange-200 overflow-hidden">
            <nav className="py-2">
              <button
                onClick={() => handleProductTabChange('single')}
                className={`w-full text-left px-4 py-3 font-medium transition-colors flex items-center gap-3 ${
                  activeTab === 'products' && productTab === 'single'
                    ? 'bg-orange-100 text-orange-800 border-r-4 border-orange-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package className="w-5 h-5" />
                單層系列
              </button>

              <button
                onClick={() => handleProductTabChange('double')}
                className={`w-full text-left px-4 py-3 font-medium transition-colors flex items-center gap-3 ${
                  activeTab === 'products' && productTab === 'double'
                    ? 'bg-orange-100 text-orange-800 border-r-4 border-orange-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package className="w-5 h-5" />
                雙粒裝系列
              </button>
              
              <button
                onClick={() => handleTabChange('cart')}
                className={`w-full text-left px-4 py-3 font-medium transition-colors flex items-center gap-3 relative ${
                  activeTab === 'cart'
                    ? 'bg-orange-100 text-orange-800 border-r-4 border-orange-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                購物車
                {cartCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </nav>

            {/* 手機版聯絡資訊 */}
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={16} />
                <span className="text-sm font-medium">訂購專線：0910-567118</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderNavigation;