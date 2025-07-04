// API configuration and utility functions
const API_BASE_URL = import.meta.env.VITE_APP_BASE_API || 'http://localhost:8080/v1';

/**
 * Get the authorization token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Create headers for API requests
 */
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Make an API request
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: createHeaders(),
    ...options
  };

  console.log('Making API request:', {
    url,
    method: config.method || 'GET',
    headers: config.headers,
    body: config.body
  });

  try {
    const response = await fetch(url, config);
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * API methods for exchanges
 */
export const exchangeAPI = {
  // Get all exchanges
  getAll: (page = 1, pageSize = 10) => apiRequest(`/exchanges/?page=${page}&page_size=${pageSize}`),

  // Get single exchange
  getById: (id) => apiRequest(`/exchanges/${id}`),

  // Create exchange
  create: (data) =>
    apiRequest('/exchanges/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Update exchange
  update: (id, data) =>
    apiRequest(`/exchanges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Delete exchange
  delete: (id) =>
    apiRequest(`/exchanges/${id}`, {
      method: 'DELETE'
    }),

  // Create queue for exchange
  createQueue: (exchangeId, queueData) =>
    apiRequest(`/exchanges/${exchangeId}/queues`, {
      method: 'POST',
      body: JSON.stringify(queueData)
    }),

  // Delete queue from exchange
  deleteQueue: (exchangeId, queueId) =>
    apiRequest(`/exchanges/${exchangeId}/queues/${queueId}`, {
      method: 'DELETE'
    })
};

export { API_BASE_URL, getAuthToken, createHeaders, apiRequest };
