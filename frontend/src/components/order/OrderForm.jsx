import React, { useState, useEffect } from 'react';
import { User, MapPin } from 'lucide-react';

const OrderForm = ({ cart, onSubmitOrder, isSubmitting }) => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    notes: ''
  });
  
  const [sameAsSender, setSameAsSender] = useState(false);

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('orderFormData');
    const savedSameAsSender = localStorage.getItem('orderFormSameAsSender');
    
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        // Only load if there's actual data (not empty form)
        const hasData = Object.values(parsedData).some(value => value && value.trim() !== '');
        if (hasData) {
          setFormData(parsedData);
        }
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
    
    if (savedSameAsSender) {
      setSameAsSender(JSON.parse(savedSameAsSender));
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('orderFormData', JSON.stringify(formData));
  }, [formData]);

  // Save sameAsSender state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('orderFormSameAsSender', JSON.stringify(sameAsSender));
  }, [sameAsSender]);

  // Handle checkbox change to copy sender info to receiver
  const handleSameAsSenderChange = (checked) => {
    setSameAsSender(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        receiverName: prev.senderName,
        receiverPhone: prev.senderPhone,
        receiverAddress: prev.senderAddress
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        receiverName: '',
        receiverPhone: '',
        receiverAddress: ''
      }));
    }
  };

  // Handle form field changes and update checkbox if needed
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If user manually changes receiver info, uncheck the checkbox
    if (field.startsWith('receiver') && sameAsSender) {
      setSameAsSender(false);
    }
  };


  const handleSubmit = () => {
    if (!formData.senderName || !formData.senderPhone || !formData.receiverName || !formData.receiverPhone) {
      alert('請填寫必要資訊');
      return;
    }
    onSubmitOrder({ ...formData, cart });
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
            onChange={(e) => {
              const newValue = e.target.value;
              handleFieldChange('senderName', newValue);
              // If checkbox is checked, also update receiver info
              if (sameAsSender) {
                setFormData(prev => ({ ...prev, senderName: newValue, receiverName: newValue }));
              }
            }}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            required
          />
          <input
            type="tel"
            placeholder="聯絡電話"
            value={formData.senderPhone}
            onChange={(e) => {
              const newValue = e.target.value;
              handleFieldChange('senderPhone', newValue);
              // If checkbox is checked, also update receiver info
              if (sameAsSender) {
                setFormData(prev => ({ ...prev, senderPhone: newValue, receiverPhone: newValue }));
              }
            }}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            required
          />
          <textarea
            placeholder="訂購人地址"
            value={formData.senderAddress}
            onChange={(e) => {
              const newValue = e.target.value;
              handleFieldChange('senderAddress', newValue);
              // If checkbox is checked, also update receiver info
              if (sameAsSender) {
                setFormData(prev => ({ ...prev, senderAddress: newValue, receiverAddress: newValue }));
              }
            }}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent h-24"
            required
          />
        </div>

        {/* 收件人資訊 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MapPin size={20} />
              收件人資訊
            </h3>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={sameAsSender}
                onChange={(e) => handleSameAsSenderChange(e.target.checked)}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
              />
              與訂購人相同
            </label>
          </div>
          <input
            type="text"
            placeholder="收件人姓名"
            value={formData.receiverName}
            onChange={(e) => handleFieldChange('receiverName', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
              sameAsSender ? 'bg-gray-100 text-gray-600' : ''
            }`}
            disabled={sameAsSender}
            required
          />
          <input
            type="tel"
            placeholder="收件人電話"
            value={formData.receiverPhone}
            onChange={(e) => handleFieldChange('receiverPhone', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
              sameAsSender ? 'bg-gray-100 text-gray-600' : ''
            }`}
            disabled={sameAsSender}
            required
          />
          <textarea
            placeholder="收件地址"
            value={formData.receiverAddress}
            onChange={(e) => handleFieldChange('receiverAddress', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent h-24 ${
              sameAsSender ? 'bg-gray-100 text-gray-600' : ''
            }`}
            disabled={sameAsSender}
            required
          />
        </div>
      </div>

      {/* 詢價流程說明 */}
      <div className="bg-orange-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">詢價流程說明</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
              1
            </div>
            <div>
              <p className="text-gray-700 font-medium">提交詢價需求</p>
              <p className="text-sm text-gray-600">填寫完整的商品資訊和聯絡方式</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
              2
            </div>
            <div>
              <p className="text-gray-700 font-medium">商家確認庫存</p>
              <p className="text-sm text-gray-600">我們會確認商品庫存狀況並計算最終報價</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
              3
            </div>
            <div>
              <p className="text-gray-700 font-medium">提供付款資訊</p>
              <p className="text-sm text-gray-600">確認有庫存後，將主動提供付款方式和帳戶資訊</p>
            </div>
          </div>
          
          <div className="mt-5 p-4 bg-orange-100 rounded-lg">
            <p className="text-orange-700 text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              重要提醒
            </p>
            <p className="text-orange-600 text-sm mt-1">
              此為詢價單，不會立即扣款。我們會在確認庫存後與您聯繫並提供完整的付款資訊。
            </p>
          </div>
        </div>
      </div>

      {/* 訂單摘要 */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">詢價單摘要</h3>
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
            <p className="text-sm text-orange-600">※ 單層運費$100，兩層以上免運</p>
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