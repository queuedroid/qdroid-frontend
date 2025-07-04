import { exchangeAPI } from '../utils/api';

export const apiConfig = {
  exchanges: exchangeAPI
};

export const getApiBaseUrl = () => {
  return import.meta.env.VITE_APP_BASE_API || 'http://localhost:8080/v1';
};
