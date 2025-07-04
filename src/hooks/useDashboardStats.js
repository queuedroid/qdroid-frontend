// Custom hook for dashboard statistics
import { useState, useCallback } from 'react';
import { apiConfig } from '../config/apiConfig';
import { calculateDashboardStats, getDefaultStats, normalizeStatsResponse } from '../utils/dashboardStats';
import { mergeStoredQueues } from '../utils/queuePersistence';

export const useDashboardStats = () => {
  const [exchangeStats, setExchangeStats] = useState(getDefaultStats());
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all exchanges with a higher limit to get accurate totals
      const response = await apiConfig.exchanges.getAll(1, 1000);

      let data;
      if (response && typeof response.json === 'function') {
        data = await response.json();
      } else {
        data = response;
      }

      console.log('Dashboard stats response:', data);

      // Normalize and calculate stats
      const { exchanges, pagination } = normalizeStatsResponse(data);

      // Merge stored queues with exchange data for accurate queue counts
      const exchangesWithQueues = mergeStoredQueues(exchanges);

      const stats = calculateDashboardStats(exchangesWithQueues, pagination);

      setExchangeStats(stats);
    } catch (error) {
      console.error('Error fetching exchange stats:', error);
      // Set default values on error
      setExchangeStats(getDefaultStats());
    } finally {
      setLoading(false);
    }
  }, []);

  return { exchangeStats, loading, fetchStats };
};
