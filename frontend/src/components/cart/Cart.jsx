import React from 'react';
import { ShoppingCart } from 'lucide-react';
import CartItem from './CartItem';
import OrderForm from '../order/OrderForm';

const Cart = ({ 
  cart, 
  onUpdateQuantity, 
  onRemove, 
  onSubmitOrder, 
  isSubmitting, 
  onBackToProducts 
}) => {
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">購物車</h2>
        <div className="text-center py-12">
          <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">購物車是空的</p>
          <button
            onClick={onBackToProducts}
            className="mt-4 bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition-colors"
          >
            繼續購物
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">購物車</h2>
      <div className="space-y-8">
        <div className="space-y-4">
          {cart.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))}
        </div>
        <OrderForm 
          cart={cart} 
          onSubmitOrder={onSubmitOrder}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default Cart;