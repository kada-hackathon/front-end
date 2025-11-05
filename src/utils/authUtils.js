/**
 * Auth Utilities
 * Handle token validation and cleanup
 */

export const validateAndCleanupToken = async () => {
  const token = localStorage.getItem('token');
  
  // Jika tidak ada token, return
  if (!token || token.trim() === '') {
    return false;
  }

  try {
    // Verify token ke backend
    const res = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      console.log('✅ Token valid');
      return true;
    } else if (res.status === 401) {
      // Token invalid atau expired (401 Unauthorized)
      console.log('❌ Token invalid or expired (401) - clearing storage');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    } else {
      // Other errors (500, 503, dll) - KEEP TOKEN
      console.warn(`⚠️ Server error (${res.status}) - keeping token`);
      return true; // Assume token still valid
    }
  } catch (err) {
    // Network error, backend down, etc - KEEP TOKEN
    console.warn('⚠️ Token verification failed (network error) - keeping token:', err.message);
    return true; // Assume token still valid
  }
};

// Logout function
export const logout = (navigate) => {
  console.log('🚪 Logging out...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/login');
};
