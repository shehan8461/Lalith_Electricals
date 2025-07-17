// API configuration
const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    SIGNIN: `${API_BASE_URL}/api/auth/signin`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    GOOGLE: `${API_BASE_URL}/api/auth/google`,
    SIGNOUT: `${API_BASE_URL}/api/auth/signout`,
  },
  USER: {
    UPDATE: `${API_BASE_URL}/api/user/update`,
    DELETE: `${API_BASE_URL}/api/user/delete`,
  },
  ADMIN: {
    REGISTER: `${API_BASE_URL}/api/admin/register`,
    SIGNIN: `${API_BASE_URL}/api/admin/signin`,
    ITEMS: `${API_BASE_URL}/api/admin/items`,
    ADD_ITEM: `${API_BASE_URL}/api/admin/add-item`,
    UPDATE_ITEM: `${API_BASE_URL}/api/admin/update-item`,
    DELETE_ITEM: `${API_BASE_URL}/api/admin/delete-item`,
  }
};

// Helper function to make API calls
export const apiCall = async (url, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export default API_ENDPOINTS;
