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

export const sendMessage = async (message) => {
  try {
    if (!liff.isLoggedIn()) {
      throw new Error('User is not logged in');
    }

    if (!liff.isApiAvailable('sendMessages')) {
      throw new Error('sendMessages API is not available');
    }

    let messageObject;

    if (typeof message === 'string') {
      messageObject = {
        type: 'text',
        text: message
      };
    } else if (typeof message === 'object' && message.type) {
      messageObject = message;
    } else {
      throw new Error('Invalid message format');
    }

    await liff.sendMessages([messageObject]);
    
    return {
      success: true,
      message: 'Message sent successfully'
    };
  } catch (error) {
    console.error('Failed to send message:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const sendTextMessage = async (text) => {
  return await sendMessage({
    type: 'text',
    text: text
  });
};

export const sendFlexMessage = async (altText, contents) => {
  return await sendMessage({
    type: 'flex',
    altText: altText,
    contents: contents
  });
};

export const sendImageMessage = async (originalContentUrl, previewImageUrl) => {
  return await sendMessage({
    type: 'image',
    originalContentUrl: originalContentUrl,
    previewImageUrl: previewImageUrl || originalContentUrl
  });
};

export const sendLocationMessage = async (title, address, latitude, longitude) => {
  return await sendMessage({
    type: 'location',
    title: title,
    address: address,
    latitude: latitude,
    longitude: longitude
  });
};

export { liff };