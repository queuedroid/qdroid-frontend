import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleError = useCallback(
    (error, customMessage = null, options = {}) => {
      console.error('Error handled by useErrorHandler:', error);

      // Check for error type in enhanced error objects
      if (error?.type === 'server') {
        setError({
          type: 'server',
          message: customMessage || error.userMessage || 'Server error occurred',
          originalError: error
        });
        return;
      }

      if (error?.type === 'network') {
        setError({
          type: 'network',
          message: customMessage || error.userMessage || 'Network connection error',
          originalError: error
        });
        return;
      }

      if (error?.type === 'not_found') {
        if (options.redirectToNotFound !== false) {
          navigate('/404');
          return;
        }
        setError({
          type: 'not_found',
          message: customMessage || error.userMessage || 'Resource not found',
          originalError: error
        });
        return;
      }

      // Handle HTTP status codes
      if (error?.response?.status === 401) {
        // Handle unauthorized - redirect to login
        if (options.redirectToLogin !== false) {
          navigate('/login');
          return;
        }
        setError({
          type: 'unauthorized',
          message: customMessage || 'Session expired. Please login again.',
          originalError: error
        });
        return;
      }

      if (error?.response?.status === 403) {
        setError({
          type: 'forbidden',
          message: customMessage || 'You do not have permission to perform this action.',
          originalError: error
        });
        return;
      }

      if (error?.response?.status === 404) {
        if (options.redirectToNotFound !== false) {
          navigate('/404');
          return;
        }
        setError({
          type: 'not_found',
          message: customMessage || 'Resource not found',
          originalError: error
        });
        return;
      }

      if (error?.response?.status >= 500) {
        setError({
          type: 'server',
          message: customMessage || 'Server error occurred',
          originalError: error
        });
        return;
      }

      if (error?.code === 'NETWORK_ERROR' || !error?.response) {
        setError({
          type: 'network',
          message: customMessage || 'Network connection error',
          originalError: error
        });
        return;
      }

      // Handle other errors
      setError({
        type: 'general',
        message: customMessage || error?.message || 'An unexpected error occurred',
        originalError: error
      });
    },
    [navigate]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const redirectToErrorPage = useCallback(
    (errorType, errorData = null) => {
      switch (errorType) {
        case 'server':
          navigate('/server-error', {
            state: { error: errorData },
            replace: true
          });
          break;
        case 'network':
          navigate('/network-error', {
            state: { error: errorData },
            replace: true
          });
          break;
        case 'not_found':
          navigate('/404', { replace: true });
          break;
        default:
          // For other errors, show in place
          setError({
            type: errorType,
            message: errorData?.message || 'An error occurred',
            originalError: errorData
          });
      }
    },
    [navigate]
  );

  const withErrorHandling = useCallback(
    (asyncFunction, options = {}) => {
      return async (...args) => {
        try {
          setIsLoading(true);
          setError(null);
          const result = await asyncFunction(...args);
          return result;
        } catch (error) {
          if (options.useCustomHandler) {
            // Allow calling code to handle the error
            throw error;
          }
          handleError(error, options.customMessage, options);
          if (options.rethrow !== false) {
            throw error; // Re-throw so calling code can handle if needed
          }
        } finally {
          setIsLoading(false);
        }
      };
    },
    [handleError]
  );

  const showUserFriendlyError = useCallback((error, fallbackMessage = 'Something went wrong') => {
    let userMessage = fallbackMessage;

    if (error?.response?.data?.message) {
      userMessage = error.response.data.message;
    } else if (error?.userMessage) {
      userMessage = error.userMessage;
    } else if (error?.message) {
      userMessage = error.message;
    }

    return userMessage;
  }, []);

  return {
    error,
    isLoading,
    handleError,
    clearError,
    withErrorHandling,
    redirectToErrorPage,
    showUserFriendlyError
  };
};
