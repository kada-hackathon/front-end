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
    } else {
      // Token invalid atau expired
      console.log('❌ Token invalid or expired - clearing storage');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  } catch (err) {
    console.error('Token verification error:', err);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

// Logout function
export const logout = (navigate) => {
  console.log('🚪 Logging out...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/login');
};
