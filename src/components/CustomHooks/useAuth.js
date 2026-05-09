import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  // Login function
  const login = (userData) => {
    setUser(userData);
    const now = new Date();
    const expiry = now.getTime() + 10 * 60 * 60 * 1000; // 10 hours from now
    setExpiryTime(expiry);
    localStorage.setItem('expiryTime', expiry); // Store expiry time in localStorage
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data
  };

  // Logout function
  const logout = () => {
    // setUser(null);
    setExpiryTime(null);
    setRemainingTime(null);
    localStorage.removeItem('expiryTime'); // Clear expiry time
    localStorage.removeItem('user'); // Clear user data
  };

  // Check session expiry on component mount
  useEffect(() => {
    const storedExpiry = localStorage.getItem('expiryTime');
    const storedUser = localStorage.getItem('user');

    if (storedExpiry && storedUser) {
      const now = new Date().getTime();
      if (now > parseInt(storedExpiry, 10)) {
        logout(); // Logout if session expired
      } else {
        setUser(JSON.parse(storedUser)); // Restore user data
        setExpiryTime(parseInt(storedExpiry, 10));
      }
    }
  }, []);

  // Update remaining time every second
  useEffect(() => {
    const updateRemainingTime = () => {
      if (expiryTime) {
        const now = new Date().getTime();
        const remaining = expiryTime - now;
        if (remaining > 0) {
          setRemainingTime(remaining);
        } else {
          logout(); // Logout if session expired
        }
      }
    };

    const interval = setInterval(updateRemainingTime, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [expiryTime]);

  return { user, login, logout, remainingTime };
};

export default useAuth;