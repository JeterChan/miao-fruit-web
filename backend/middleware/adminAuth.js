// Admin authentication middleware
const adminAuth = (req, res, next) => {
  // Check for admin credentials in different ways
  
  // Method 1: Check for admin header (for development/testing)
  const adminHeader = req.headers['x-admin-key'];
  
  // Method 2: Check for basic auth
  const authHeader = req.headers.authorization;
  
  // Method 3: Check for admin session/token (if implementing session-based auth)
  const adminSession = req.session?.isAdmin;
  
  // Admin credentials from environment variables
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
  
  try {
    // Check API key header first (simplest method)
    if (adminHeader === ADMIN_API_KEY) {
      return next();
    }
    
    // Check basic authentication
    if (authHeader && authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.slice('Basic '.length);
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return next();
      }
    }
    
    // Check session-based auth (if implemented)
    if (adminSession === true) {
      return next();
    }
    
    // Development mode bypass (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Admin auth bypassed in development mode');
      return next();
    }
    
    // No valid admin authentication found
    return res.status(401).json({
      status: 'error',
      message: '需要管理員權限才能存取此資源',
      code: 'ADMIN_AUTH_REQUIRED'
    });
    
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: '驗證過程發生錯誤'
    });
  }
};

// Helper function to generate basic auth header (for testing)
const generateBasicAuthHeader = (username, password) => {
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${credentials}`;
};

module.exports = {
  adminAuth,
  generateBasicAuthHeader
};