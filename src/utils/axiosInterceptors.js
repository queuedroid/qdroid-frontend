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

      if (error.response) {
        // Server responded with error status
        const { status } = error.response;

        if (status === 401) {
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

            // Call the centralized logout function (async)
            handleLogout().catch((logoutError) => {
              console.error('Error during logout:', logoutError);
            });

            // Reset the flag after a delay to allow for potential retries
            setTimeout(() => {
              isLoggingOut = false;
            }, 1000);
          }

          // Don't redirect immediately, let the error bubble up
          // The error handler will decide what to do
          return Promise.reject(error);
        }

        if (status >= 500) {
          // Server error - could redirect to error page
          console.error('🚨 Server error detected:', status);

          // Enhanced error object for better handling
          const enhancedError = {
            ...error,
            type: 'server',
            userMessage: "We're experiencing server issues. Please try again later."
          };

          return Promise.reject(enhancedError);
        }

        if (status === 404) {
          console.error('🚨 Resource not found:', error.config?.url);

          const enhancedError = {
            ...error,
            type: 'not_found',
            userMessage: 'The requested resource was not found.'
          };

          return Promise.reject(enhancedError);
        }

        // Other HTTP errors
        return Promise.reject(error);
      } else if (error.request) {
        // Network error
        console.error('🚨 Network error detected:', error.message);

        const enhancedError = {
          ...error,
          type: 'network',
          userMessage: 'Unable to connect to the server. Please check your internet connection.'
        };

        return Promise.reject(enhancedError);
      } else {
        // Something else happened
        console.error('🚨 Unknown error:', error.message);
        return Promise.reject(error);
      }
    }
  );
};
