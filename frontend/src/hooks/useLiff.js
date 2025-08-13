import { useState, useEffect } from 'react';
import liffService from '../services/liff';

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
        const success = await liffService.init(liffId);
        if (success) {
          setIsInitialized(true);
          const loggedIn = liffService.isLoggedIn();
          setIsLoggedIn(loggedIn);
          
          if (loggedIn) {
            const userProfile = await liffService.getProfile();
            setProfile(userProfile);
          }
        } else {
          setError('Failed to initialize LIFF');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initLiff();
  }, [liffId]);

  const login = async () => {
    try {
      await liffService.login();
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = () => {
    try {
      liffService.logout();
      setIsLoggedIn(false);
      setProfile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const sendMessage = async (message) => {
    try {
      return await liffService.sendMessage(message);
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    isInitialized,
    isLoggedIn,
    profile,
    error,
    loading,
    login,
    logout,
    sendMessage,
    closeWindow: liffService.closeWindow.bind(liffService),
    getOS: liffService.getOS.bind(liffService),
    isInClient: liffService.isInClient.bind(liffService)
  };
};