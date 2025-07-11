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
      const exchangesResponse = await apiConfig.exchanges.getAll(1, 1000);

      let exchangesData;
      if (exchangesResponse && typeof exchangesResponse.json === 'function') {
        exchangesData = await exchangesResponse.json();
      } else {
        exchangesData = exchangesResponse;
      }

      console.log('Dashboard stats response:', exchangesData);

      // Normalize and calculate basic stats
      const { exchanges, pagination } = normalizeStatsResponse(exchangesData);

      // Merge stored queues with exchange data for accurate queue counts
      const exchangesWithQueues = mergeStoredQueues(exchanges);

      const baseStats = calculateDashboardStats(exchangesWithQueues, pagination);

      // Fetch event logs summary for message statistics
      try {
        // Fetch summaries for all categories like in the event logs page
        const categories = ['MESSAGE', 'PAYMENT', 'AUTH'];
        let combinedSummary = {
          total_count: 0,
          total_queued: 0,
          total_pending: 0,
          total_failed: 0
        };

        // Fetch summary for each category and combine
        for (const cat of categories) {
          try {
            const response = await apiConfig.eventLogs.getSummary(cat);
            let data;
            if (response && typeof response.json === 'function') {
              data = await response.json();
            } else {
              data = response;
            }

            if (data && data.data) {
              combinedSummary.total_count += data.data.total_count || 0;
              combinedSummary.total_queued += data.data.total_queued || 0;
              combinedSummary.total_pending += data.data.total_pending || 0;
              combinedSummary.total_failed += data.data.total_failed || 0;
            }
          } catch (err) {
            console.error(`Error fetching summary for ${cat}:`, err);
          }
        }

        console.log('Combined event logs summary:', combinedSummary);

        // Extract message statistics from combined event logs
        const messagesSent = combinedSummary.total_count || 0;
        const messagesQueued = combinedSummary.total_queued || combinedSummary.total_pending || 0;

        console.log('Extracted message stats:', { messagesSent, messagesQueued });

        // Update stats with event logs data
        setExchangeStats({
          ...baseStats,
          messagesSent,
          messagesQueued
        });
      } catch (eventLogsError) {
        console.error('Error fetching event logs summary:', eventLogsError);
        // Use base stats if event logs fail
        setExchangeStats(baseStats);
      }
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
