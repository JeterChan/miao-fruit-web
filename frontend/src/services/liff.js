class LiffService {
  constructor() {
    this.liff = window.liff;
    this.initialized = false;
  }

  async init(liffId) {
    try {
      await this.liff.init({ liffId });
      this.initialized = true;
      console.log('LIFF initialized successfully');
      return true;
    } catch (error) {
      console.error('LIFF initialization failed:', error);
      return false;
    }
  }

  isLoggedIn() {
    return this.initialized && this.liff.isLoggedIn();
  }

  async login() {
    if (!this.initialized) {
      console.error('LIFF not initialized');
      return;
    }
    this.liff.login();
  }

  logout() {
    if (!this.initialized) {
      console.error('LIFF not initialized');
      return;
    }
    this.liff.logout();
  }

  async getProfile() {
    if (!this.isLoggedIn()) {
      console.error('User not logged in');
      return null;
    }
    try {
      return await this.liff.getProfile();
    } catch (error) {
      console.error('Failed to get profile:', error);
      return null;
    }
  }

  async sendMessage(message) {
    if (!this.isLoggedIn()) {
      console.error('User not logged in');
      return false;
    }
    try {
      await this.liff.sendMessages([message]);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  closeWindow() {
    if (!this.initialized) {
      console.error('LIFF not initialized');
      return;
    }
    this.liff.closeWindow();
  }

  getOS() {
    if (!this.initialized) {
      return 'unknown';
    }
    return this.liff.getOS();
  }

  isInClient() {
    return this.initialized && this.liff.isInClient();
  }
}

export default new LiffService();