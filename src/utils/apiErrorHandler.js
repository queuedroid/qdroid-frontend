// utils/apiErrorHandler.js
import { handleLogout } from './api';

/**
 * Higher-order function that wraps API calls to handle 401 errors
 * Use this for any API calls that might need extra 401 error handling
 */
export const withErrorHandling = (apiCall) => {
  return async (...args) => {
    try {
      return await apiCall(...args);
    } catch (error) {
      // Check for 401 error
      if (error.response?.status === 401) {
        console.error('🚨 401 error detected in API call wrapper');
        console.error('Error details:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response.status,
          message: error.response.data?.message || error.message
        });

        // Call logout function
        handleLogout();
      }

      // Re-throw the error so calling code can handle it
      throw error;
    }
  };
};

/**
 * Utility to manually check for 401 errors in catch blocks
 */
export const handle401Error = (error) => {
  if (error.response?.status === 401) {
    console.error('🚨 Manual 401 error handler triggered');
    console.error('Error details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response.status,
      message: error.response.data?.message || error.message
    });

    handleLogout();
    return true; // Indicates that 401 was handled
  }

  return false; // Indicates that this was not a 401 error
};

export default { withErrorHandling, handle401Error };
