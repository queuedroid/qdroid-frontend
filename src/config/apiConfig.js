import { exchangeAPI, eventLogsAPI } from '../utils/api';

export const apiConfig = {
  exchanges: exchangeAPI,
  eventLogs: eventLogsAPI
};

export const getApiBaseUrl = () => {
  return import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/v1';
};
