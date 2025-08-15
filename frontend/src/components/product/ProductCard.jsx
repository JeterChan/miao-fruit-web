import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(0);

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      // 只有當數量大於 0 時才加入購物車
      for (let i = 0; i < quantity; i++) {
        onAddToCart(product);
      }
      // 重置數量
      setQuantity(0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
      <div className="p-3 sm:p-6">
        <div className="flex justify-between items-start mb-2 sm:mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">{product.grade} 等級</h3>
            <p className="text-gray-600 text-sm sm:text-base mt-1">{product.quantity}粒裝</p>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-green-600">${product.price}</div>
            <div className="text-xs sm:text-sm text-gray-500">單盒價格</div>
          </div>
        </div>
        
        {/* 數量控制區域 - 始終顯示 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleDecrease}
              disabled={quantity === 0}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors ${
                quantity === 0 
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <Minus size={12} className="sm:w-4 sm:h-4" />
            </button>
            
            <div className="min-w-[1.5rem] sm:min-w-[2rem] text-center">
              <span className="text-sm sm:text-base font-semibold text-gray-800">{quantity}</span>
            </div>
            
            <button
              onClick={handleIncrease}
              className="bg-orange-400 hover:bg-orange-500 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <Plus size={12} className="sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* 加入購物車按鈕 */}
          <button
            onClick={handleAddToCart}
            disabled={quantity === 0}
            className={`px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-md flex items-center gap-1 transition-colors shadow-sm text-xs sm:text-sm ${
              quantity === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <ShoppingCart size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">加入</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>

        {/* 顯示總價 */}
        {quantity > 0 && (
          <div className="mt-2 pt-2 sm:mt-4 sm:pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">預計小計：</span>
              <span className="text-base sm:text-lg font-bold text-green-600">
                ${(product.price * quantity).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;