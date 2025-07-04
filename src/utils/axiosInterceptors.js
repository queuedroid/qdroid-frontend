// utils/axiosInterceptors.js
import axios from 'axios';
import { handleLogout, getAuthToken } from './api';

// Flag to prevent multiple logout attempts
let isLoggingOut = false;

/**
 * Setup axios interceptors to handle 401 errors globally
 */
export const setupAxiosInterceptors = () => {
  // Add a request interceptor to include auth token in all requests
  axios.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Debug logging (remove in production)
      console.log('Making axios request:', {
        url: config.url,
        method: config.method,
        hasAuthToken: !!token
      });

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axios.interceptors.response.use(
    (response) => {
      // Any status code that lies within the range of 2xx causes this function to trigger
      return response;
    },
    (error) => {
      // Any status codes that falls outside the range of 2xx causes this function to trigger
      console.log('Axios interceptor caught error:', error);

      if (error.response && error.response.status === 401) {
        console.error('🚨 401 UNAUTHORIZED ERROR DETECTED 🚨');
        console.error('Session expired or invalid token. Logging out user automatically.');
        console.error('Error details:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          message: error.response.data?.message || error.message
        });

        // Prevent multiple logout attempts
        if (!isLoggingOut) {
          isLoggingOut = true;

          // Call the centralized logout function
          handleLogout();

          // Reset the flag after a delay to allow for potential retries
          setTimeout(() => {
            isLoggingOut = false;
          }, 1000);
        }

        // Return a rejected promise so the calling code can still handle the error if needed
        return Promise.reject(error);
      }

      // For all other errors, just pass them through
      return Promise.reject(error);
    }
  );
};
