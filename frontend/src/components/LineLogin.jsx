import React from 'react';
import { useLiff } from '../hooks/useLiff';

const LineLogin = () => {
  const {
    isInitialized,
    isLoggedIn,
    profile,
    error,
    loading,
    login,
    logout,
    sendMessages
  } = useLiff(process.env.REACT_APP_LIFF_ID);

  const handleSendMessage = async () => {
    try {
      await sendMessages([
        {
          type: 'text',
          text: `您好！我是 ${profile?.displayName}，來自妙媽媽果園網站的訊息。`
        }
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">初始化 LINE...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>LINE 初始化錯誤: {error}</p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>LINE 尚未初始化完成</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">LINE 登入狀態</h3>
      
      {!isLoggedIn ? (
        <div className="text-center">
          <p className="mb-4 text-gray-600">請登入 LINE 帳號以使用完整功能</p>
          <button
            onClick={login}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.629 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            使用 LINE 登入
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            {profile?.pictureUrl && (
              <img 
                src={profile.pictureUrl} 
                alt="Profile" 
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
            )}
            <h4 className="font-semibold">{profile?.displayName}</h4>
            <p className="text-gray-600 text-sm">{profile?.statusMessage}</p>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleSendMessage}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              發送測試訊息
            </button>
            
            <button
              onClick={logout}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              登出
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineLogin;