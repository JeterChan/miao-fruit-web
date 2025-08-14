import liff from '@line/liff';

const LIFF_ID = process.env.REACT_APP_LIFF_ID || 'your-liff-id-here';

export const initializeLiff = async () => {
  try {
    await liff.init({
      liffId: LIFF_ID
    });
    
    if (liff.isLoggedIn()) {
      console.log('User is logged in');
      return {
        success: true,
        isLoggedIn: true,
        profile: await liff.getProfile()
      };
    } else {
      console.log('User is not logged in');
      return {
        success: true,
        isLoggedIn: false
      };
    }
  } catch (error) {
    console.error('LIFF initialization failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const loginWithLiff = () => {
  if (!liff.isLoggedIn()) {
    liff.login();
  }
};

export const logoutFromLiff = () => {
  if (liff.isLoggedIn()) {
    liff.logout();
  }
};

// Send message to specific user via backend API using LINE Messaging API
export const sendMessageToUser = async (userId, message) => {
  try {
    const response = await fetch('/api/line/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        message: message
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send message');
    }

    return {
      success: true,
      message: 'Message sent to user successfully'
    };
  } catch (error) {
    console.error('Failed to send message to user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const sendTextMessage = async (userId, text) => {
  return await sendMessageToUser(userId, {
    type: 'text',
    text: text
  });
};

export const sendFlexMessage = async (userId, altText, contents) => {
  return await sendMessageToUser(userId, {
    type: 'flex',
    altText: altText,
    contents: contents
  });
};

export const sendImageMessage = async (userId, originalContentUrl, previewImageUrl) => {
  return await sendMessageToUser(userId, {
    type: 'image',
    originalContentUrl: originalContentUrl,
    previewImageUrl: previewImageUrl || originalContentUrl
  });
};

export const sendLocationMessage = async (userId, title, address, latitude, longitude) => {
  return await sendMessageToUser(userId, {
    type: 'location',
    title: title,
    address: address,
    latitude: latitude,
    longitude: longitude
  });
};

export { liff };