import React, { useState } from 'react';
import { useLiff } from '../hooks/useLiff';
import lineMessagingService from '../services/lineMessagingService';

const LineDebug = () => {
  const { profile, isLoggedIn, loading, error } = useLiff(process.env.REACT_APP_LIFF_ID);
  const [testMessage, setTestMessage] = useState('Hello from development! 🧪');
  const [sendingMessage, setSendingMessage] = useState(false);

  const handleSendTestMessage = async () => {
    try {
      setSendingMessage(true);
      await lineMessagingService.sendSimpleMessage(testMessage);
      alert('Test message sent!');
    } catch (error) {
      alert('Failed to send message: ' + error.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendTestOrder = async () => {
    const mockOrder = {
      id: 'DEV' + Date.now(),
      total: 199,
      status: 'confirmed',
      items: [
        { name: '測試商品', quantity: 1, price: 199 }
      ]
    };

    try {
      setSendingMessage(true);
      await lineMessagingService.sendOrderDetailsViaMemo(mockOrder);
      alert('Test order message sent!');
    } catch (error) {
      alert('Failed to send order message: ' + error.message);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) return <div className="p-4">Loading LIFF...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 rounded-lg max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-4">🧪 LINE Debug Panel</h3>
      
      <div className="space-y-4">
        <div>
          <strong>Login Status:</strong> {isLoggedIn ? '✅ Logged in' : '❌ Not logged in'}
        </div>
        
        {profile && (
          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold mb-2">User Profile:</h4>
            <div className="text-sm space-y-1">
              <div><strong>User ID:</strong> {profile.userId}</div>
              <div><strong>Name:</strong> {profile.displayName}</div>
              <div><strong>Status:</strong> {profile.statusMessage || 'None'}</div>
              {profile.pictureUrl && (
                <img src={profile.pictureUrl} alt="Profile" className="w-12 h-12 rounded-full mt-2" />
              )}
            </div>
          </div>
        )}

        {isLoggedIn && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Test Message:</label>
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <button
              onClick={handleSendTestMessage}
              disabled={sendingMessage}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {sendingMessage ? 'Sending...' : 'Send Test Message'}
            </button>
            
            <button
              onClick={handleSendTestOrder}
              disabled={sendingMessage}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {sendingMessage ? 'Sending...' : 'Send Test Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineDebug;