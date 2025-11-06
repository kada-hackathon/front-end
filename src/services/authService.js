// Centralized token management
export const authService = {
  getToken() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      return token;
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    }
  },

  removeToken() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};