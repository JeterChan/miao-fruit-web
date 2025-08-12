import { useState, useEffect, useCallback } from 'react';
import liffService from '../services/liffService';

export const useLiff = (liffId) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initLiff = async () => {
      if (!liffId) {
        setError('LIFF ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        await liffService.init(liffId);
        setIsInitialized(true);
        
        const loggedIn = liffService.isLoggedIn();
        setIsLoggedIn(loggedIn);
        
        if (loggedIn) {
          const userProfile = await liffService.getProfile();
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('LIFF initialization error:', err);
        setError(err.message);
        setIsInitialized(false);
      } finally {
        setLoading(false);
      }
    };

    initLiff();
  }, [liffId]);

  const login = useCallback(async () => {
    try {
      setError(null);
      await liffService.login();
      
      // After login, update states
      setTimeout(async () => {
        const loggedIn = liffService.isLoggedIn();
        setIsLoggedIn(loggedIn);
        
        if (loggedIn) {
          const userProfile = await liffService.getProfile();
          setProfile(userProfile);
        }
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      setError(null);
      liffService.logout();
      setIsLoggedIn(false);
      setProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  }, []);

  const sendMessages = useCallback(async (messages) => {
    try {
      setError(null);
      await liffService.sendMessages(messages);
    } catch (err) {
      console.error('Send messages error:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  const closeWindow = useCallback(() => {
    liffService.closeWindow();
  }, []);

  return {
    isInitialized,
    isLoggedIn,
    profile,
    error,
    loading,
    login,
    logout,
    sendMessages,
    closeWindow,
    liffService
  };
};

export default useLiff;