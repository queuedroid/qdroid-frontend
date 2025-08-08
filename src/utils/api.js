// API configuration and utility functions
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/v1';

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
 * Logout user and redirect to login page
 */
const handleLogout = async () => {
  try {
    // Get the auth token before clearing it
    const token = getAuthToken();

    if (token) {
      // Call the logout API endpoint to invalidate the session
      const logoutUrl = `${import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/v1'}/auth/logout`;

      try {
        await fetch(logoutUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Successfully logged out from server');
      } catch (apiError) {
        console.warn('⚠️ Failed to call logout API, but continuing with local logout:', apiError);
      }
    }
  } catch (error) {
    console.warn('⚠️ Error during logout API call, but continuing with local logout:', error);
  }

  // Always clear all authentication data regardless of API call success
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('email');

  // Clear any other user-related data
  localStorage.removeItem('userProfile');
  localStorage.removeItem('onboardingComplete');

  // Show a message to the user
  console.log('🚨 Session expired. Logging out user and redirecting to login...');

  // Create a visual notification for the user
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #f44336;
    color: white;
    padding: 16px;
    border-radius: 4px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    max-width: 300px;
  `;
  notification.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 4px;">Session Expired</div>
    <div>Your session has expired. Please log in again.</div>
  `;
  document.body.appendChild(notification);

  // Remove notification after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 4000);

  // Redirect to login page with a small delay to ensure the user sees the notification
  setTimeout(() => {
    // Try React Router first if available, fallback to window.location
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, 500);
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

    // Check for 401 Unauthorized error
    if (response.status === 401) {
      console.error('401 Unauthorized - Session expired. Logging out user.');
      handleLogout().catch((logoutError) => {
        console.error('Error during logout:', logoutError);
      });
      return; // Don't continue processing the response
    }

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Parse JSON response
    const data = await response.json();
    console.log('Parsed API Data:', data);
    return data;
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
    }),

  // Purge queue (remove all messages)
  // Note: If this returns 405, the endpoint might not be implemented yet
  purgeQueue: (exchangeId, queueId) =>
    apiRequest(`/exchanges/${exchangeId}/queues/${queueId}/purge`, {
      method: 'DELETE'
    }),

  // Get queues for an exchange (paginated)
  getQueues: (exchangeId, page = 1, pageSize = 10) => apiRequest(`/exchanges/${exchangeId}/queues?page=${page}&page_size=${pageSize}`),

  // Get exchange connection details
  getConnectionDetails: (exchangeId) => apiRequest(`/exchanges/${exchangeId}/connection`),

  // Get queue connection details
  getQueueConnectionDetails: (exchangeId, queueId) => apiRequest(`/exchanges/${exchangeId}/queues/${queueId}/connection`)
};

/**
 * API methods for messages
 */
export const messageAPI = {
  // Send single message
  sendSingle: (messageData) =>
    apiRequest('/messages/send', {
      method: 'POST',
      body: JSON.stringify(messageData)
    }),

  // Send multiple messages in bulk
  sendBulk: (bulkMessageData) =>
    apiRequest('/messages/bulk-send', {
      method: 'POST',
      body: JSON.stringify(bulkMessageData)
    })
};

/**
 * API methods for event logs
 */
export const eventLogsAPI = {
  getAll: (page = 1, pageSize = 10, category = null, status = null) => {
    const params = new URLSearchParams({ page: page.toString(), page_size: pageSize.toString() });
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    return apiRequest(`/event-logs?${params.toString()}`);
  },
  getSummary: (category) => {
    const params = new URLSearchParams({ category });
    return apiRequest(`/event-logs/summary?${params.toString()}`);
  }
};

/**
 * API methods for API keys
 */
export const apiKeysAPI = {
  // Get all API keys (paginated)
  getAll: (page = 1, pageSize = 10) => apiRequest(`/auth/api-keys?page=${page}&page_size=${pageSize}`),

  // Create new API key
  create: (apiKeyData) =>
    apiRequest('/auth/api-keys', {
      method: 'POST',
      body: JSON.stringify(apiKeyData)
    }),

  // Delete API key
  delete: (keyId) =>
    apiRequest(`/auth/api-keys/${keyId}`, {
      method: 'DELETE'
    })
};

/**
 * API methods for user authentication and account management
 */
export const userAPI = {
  // Change user password
  changePassword: (passwordData) =>
    apiRequest('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    }),

  // Delete user account
  deleteAccount: (passwordData) =>
    apiRequest('/users/', {
      method: 'DELETE',
      body: JSON.stringify(passwordData)
    })
};

export { API_BASE_URL, getAuthToken, createHeaders, apiRequest, handleLogout };
