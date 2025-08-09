import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, cartCount }) => (
  <nav className="bg-white shadow-sm sticky top-0 z-10">
    <div className="container mx-auto px-4">
      <div className="flex space-x-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-4 px-6 border-b-2 font-medium transition-colors ${
            activeTab === 'products'
              ? 'border-orange-400 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package className="inline-block w-4 h-4 mr-2" />
          產品列表
        </button>
        <button
          onClick={() => setActiveTab('cart')}
          className={`py-4 px-6 border-b-2 font-medium transition-colors relative ${
            activeTab === 'cart'
              ? 'border-orange-400 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingCart className="inline-block w-4 h-4 mr-2" />
          購物車
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  </nav>
);

export default Navigation;