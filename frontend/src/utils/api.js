// frontend/src/utils/api.js

const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Generic fetch with authentication
export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    ...options.headers,
  };
  
  // Add authorization token if available
  if (token && !(options.body instanceof FormData)) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['Content-Type'] = 'application/json';
  } else if (token && options.body instanceof FormData) {
    headers['Authorization'] = `Bearer ${token}`;
    // Don't set Content-Type for FormData, browser will set it with boundary
  } else if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// API object with all endpoints
export const api = {
  // Auth
  register: (userData) => apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getMe: () => apiFetch('/auth/me'),
  
  // Wardrobe
  getWardrobe: () => apiFetch('/wardrobe'),
  
  addToWardrobe: (formData) => apiFetch('/wardrobe', {
    method: 'POST',
    body: formData,
  }),
  
  deleteWardrobeItem: (id) => apiFetch(`/wardrobe/${id}`, {
    method: 'DELETE',
  }),
  
  // Contact
  sendContact: (data) => apiFetch('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Recommendations
  getRecommendations: (skinTone, occasion) => 
    apiFetch(`/styles/recommendations?skinTone=${skinTone}&occasion=${occasion}`),
};

export default api;