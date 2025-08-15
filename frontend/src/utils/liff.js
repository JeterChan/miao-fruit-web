import liff from '@line/liff';

const LIFF_ID = process.env.REACT_APP_LIFF_ID || 'your-liff-id-here';

export const initializeLiff = async () => {
  try {
    await liff.init({
      liffId: LIFF_ID
    });
    
    if (liff.isLoggedIn()) {
      return {
        success: true,
        isLoggedIn: true,
        profile: await liff.getProfile()
      };
    } else {
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


export { liff };