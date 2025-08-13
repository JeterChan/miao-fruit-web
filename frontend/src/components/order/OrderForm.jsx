import React, { useState } from 'react';
import { User, MapPin } from 'lucide-react';
import { useLiff } from '../../hooks/useLiff';

const OrderForm = ({ cart, onSubmitOrder, isSubmitting }) => {
  const { profile } = useLiff(process.env.REACT_APP_LIFF_ID);
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    notes: ''
  });

  const handleSubmit = () => {
    if (!formData.senderName || !formData.senderPhone || !formData.receiverName || !formData.receiverPhone) {
      alert('請填寫必要資訊');
      return;
    }
    onSubmitOrder({ ...formData, cart }, profile?.userId);
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const shipping = totalAmount >= 1000 ? 0 : 100;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* 訂購人資訊 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User size={20} />
            訂購人資訊
          </h3>
          <input
            type="text"
            placeholder="訂購人姓名"
            value={formData.senderName}
            onChange={(e) => setFormData({...formData, senderName: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            required
          />
          <input
            type="tel"
            placeholder="聯絡電話"
            value={formData.senderPhone}
            onChange={(e) => setFormData({...formData, senderPhone: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            required
          />
          <textarea
            placeholder="訂購人地址"
            value={formData.senderAddress}
            onChange={(e) => setFormData({...formData, senderAddress: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent h-24"
            required
          />
        </div>

        {/* 收件人資訊 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MapPin size={20} />
            收件人資訊
          </h3>
          <input
            type="text"
            placeholder="收件人姓名"
            value={formData.receiverName}
            onChange={(e) => setFormData({...formData, receiverName: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            required
          />
          <input
            type="tel"
            placeholder="收件人電話"
            value={formData.receiverPhone}
            onChange={(e) => setFormData({...formData, receiverPhone: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            required
          />
          <textarea
            placeholder="收件地址"
            value={formData.receiverAddress}
            onChange={(e) => setFormData({...formData, receiverAddress: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent h-24"
            required
          />
        </div>
      </div>

      {/* 付款方式 */}
      <div className="bg-orange-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">付款方式</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="匯款"
              checked={formData.paymentMethod === '匯款'}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              className="w-4 h-4 text-orange-500"
              required
            />
            <span>銀行匯款/轉帳</span>
          </label>
          <div className="ml-7 text-sm text-gray-600 space-y-1">
            <p>中華郵政代號: 700</p>
            <p>戶名: 劉芳妙</p>
            <p>帳號: 0291377-0159424</p>
            <p className="text-orange-600 text-sm mt-4">
              ※ 匯款完成後，請務必告知「匯款帳號末5碼」及「匯款金額」
            </p>
          </div>
        </div>
      </div>

      {/* 訂單摘要 */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">訂單摘要</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>商品小計</span>
            <span>${totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>運費</span>
            <span>{shipping === 0 ? '免運費' : `$${shipping}`}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>總計</span>
            <span className="text-green-600">${totalAmount + shipping}</span>
          </div>
          {totalAmount < 1000 && (
            <p className="text-sm text-orange-600">※ 單筆運費$100，滿$1000免運費</p>
          )}
          <p className="text-red-500">只限「郵局宅配」運送（週一～週四寄貨）</p>
        </div>
      </div>

      {/* 備註 */}
      <textarea
        placeholder="備註事項"
        value={formData.notes}
        onChange={(e) => setFormData({...formData, notes: e.target.value})}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent h-20"
      />

      {/* 提交按鈕 */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '提交中...' : '提交訂單'}
      </button>
    </div>
  );
};

export default OrderForm;