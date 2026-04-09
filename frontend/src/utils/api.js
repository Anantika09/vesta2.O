// frontend/src/utils/api.js
const API_BASE_URL = 'https://vesta-wfcf.onrender.com/api';

const getToken = () => {
  return localStorage.getItem('token');
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    ...options.headers,
  };
  
  if (token && !(options.body instanceof FormData)) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['Content-Type'] = 'application/json';
  } else if (token && options.body instanceof FormData) {
    headers['Authorization'] = `Bearer ${token}`;
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

export const api = {
  register: (userData) => apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getMe: () => apiFetch('/auth/me'),
  
  getWardrobe: () => apiFetch('/wardrobe'),
  
  addToWardrobe: (formData) => apiFetch('/wardrobe', {
    method: 'POST',
    body: formData,
  }),
  
  deleteWardrobeItem: (id) => apiFetch(`/wardrobe/${id}`, {
    method: 'DELETE',
  }),
  
  sendContact: (data) => apiFetch('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getRecommendations: (skinTone, occasion) => 
    apiFetch(`/styles/recommendations?skinTone=${skinTone}&occasion=${occasion}`),
};

export default api;