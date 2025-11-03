// Centralized API Configuration
// Update BASE_URL here to change all API endpoints globally

// const BASE_URL = 'https://nebwork-backend-fx667.ondigitalocean.app';
const BASE_URL = 'http://localhost:5000';

// AUTH ENDPOINTS
export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_URL}/api/auth/login`,
  LOGOUT: `${BASE_URL}/api/auth/logout`,
  PROFILE: `${BASE_URL}/api/auth/profile`,
  FORGOT_PASSWORD: `${BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/api/auth/reset-password`,
};

// WORKLOG ENDPOINTS
export const WORKLOG_ENDPOINTS = {
  LIST: `${BASE_URL}/api/worklogs`,                    // GET all, POST create
  ONE: (id) => `${BASE_URL}/api/worklogs/${id}`,       // GET, PUT, DELETE single
  FILTER : `${BASE_URL}/api/worklogs/filter`,  // GET user logs
};

// ADMIN ENDPOINTS
export const ADMIN_ENDPOINTS = {
  EMPLOYEES: `${BASE_URL}/api/admin/employees`,                // GET all, DELETE user
  EMPLOYEE: (id) => `${BASE_URL}/api/admin/employees/${id}`,   // GET single user
};

// CHATBOT ENDPOINTS
export const CHATBOT_ENDPOINTS = {
  SEND_MESSAGE: `${BASE_URL}/api/chatbot`,
  GET_HISTORY: (sessionId) => `${BASE_URL}/api/chatbot/session/${sessionId}`,
};

// Export base URL for direct use
export default BASE_URL;
