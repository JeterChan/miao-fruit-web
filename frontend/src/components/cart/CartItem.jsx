import React from 'react';
import { Plus, Minus } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center">
        <span className="text-yellow-800 font-bold text-sm">{item.grade}</span>
      </div>
      <div>
        <h4 className="font-semibold">{item.grade} 等級</h4>
        <p className="text-sm text-gray-600">{item.quantity}粒裝</p>
        <p className="text-lg font-bold text-green-600">${item.price}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.cartQuantity - 1)}
          className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-semibold">{item.cartQuantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.cartQuantity + 1)}
          className="bg-orange-400 hover:bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700 ml-4"
      >
        移除
      </button>
    </div>
  </div>
);

export default CartItem;