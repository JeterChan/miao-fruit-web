class LiffService {
  constructor() {
    this.liff = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  async init(liffId) {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._initLiff(liffId);
    return this.initPromise;
  }

  async _initLiff(liffId) {
    try {
      if (typeof window === 'undefined' || !window.liff) {
        throw new Error('LIFF SDK not loaded');
      }

      this.liff = window.liff;
      await this.liff.init({ liffId });
      this.isInitialized = true;
      
      console.log('LIFF initialized successfully');
      return true;
    } catch (error) {
      console.error('LIFF initialization failed:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  isLoggedIn() {
    if (!this.isInitialized || !this.liff) return false;
    return this.liff.isLoggedIn();
  }

  async login() {
    if (!this.isInitialized || !this.liff) {
      throw new Error('LIFF not initialized');
    }
    
    if (!this.isLoggedIn()) {
      this.liff.login();
    }
  }

  logout() {
    if (!this.isInitialized || !this.liff) return;
    this.liff.logout();
  }

  async getProfile() {
    if (!this.isInitialized || !this.liff) {
      throw new Error('LIFF not initialized');
    }

    if (!this.isLoggedIn()) {
      throw new Error('User not logged in');
    }

    try {
      return await this.liff.getProfile();
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  }

  async sendMessages(messages) {
    if (!this.isInitialized || !this.liff) {
      throw new Error('LIFF not initialized');
    }

    try {
      await this.liff.sendMessages(messages);
    } catch (error) {
      console.error('Failed to send messages:', error);
      throw error;
    }
  }

  closeWindow() {
    if (!this.isInitialized || !this.liff) return;
    this.liff.closeWindow();
  }

  getOS() {
    if (!this.isInitialized || !this.liff) return null;
    return this.liff.getOS();
  }

  isInClient() {
    if (!this.isInitialized || !this.liff) return false;
    return this.liff.isInClient();
  }
}

export const liffService = new LiffService();
export default liffService;