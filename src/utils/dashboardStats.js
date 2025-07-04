/**
 * Calculate statistics from exchange data
 * @param {Array} exchanges - Array of exchange objects from API
 * @param {Object} pagination - Pagination object from API response
 * @returns {Object} Statistics object with totals
 */
export const calculateDashboardStats = (exchanges = [], pagination = {}) => {
  const total = pagination?.total || pagination?.totalCount || exchanges.length;

  // Calculate accurate queue statistics
  let totalQueues = 0;
  let totalMessagesSent = 0;
  let totalMessagesQueued = 0;

  exchanges.forEach((exchange) => {
    // Count queues for this exchange
    const queueCount = exchange.queues?.length || 0;
    totalQueues += queueCount;

    // If exchange has message statistics, add them
    if (exchange.stats) {
      totalMessagesSent += exchange.stats.messagesSent || 0;
      totalMessagesQueued += exchange.stats.messagesQueued || 0;
    }

    // Alternative: if stats are stored directly on exchange
    if (exchange.messagesSent) {
      totalMessagesSent += exchange.messagesSent;
    }
    if (exchange.messagesQueued) {
      totalMessagesQueued += exchange.messagesQueued;
    }
  });

  return {
    totalExchanges: total,
    activeQueues: totalQueues,
    messagesSent: totalMessagesSent,
    messagesQueued: totalMessagesQueued
  };
};

/**
 * Format statistics for display
 * @param {Object} stats - Statistics object
 * @returns {Object} Formatted statistics
 */
export const formatDashboardStats = (stats) => {
  return {
    totalExchanges: stats.totalExchanges.toString(),
    activeQueues: stats.activeQueues.toString(),
    messagesSent: stats.messagesSent.toLocaleString(),
    messagesQueued: stats.messagesQueued.toLocaleString()
  };
};

/**
 * Get default/empty statistics
 * @returns {Object} Default statistics object
 */
export const getDefaultStats = () => ({
  totalExchanges: 0,
  activeQueues: 0,
  messagesSent: 0,
  messagesQueued: 0
});

/**
 * Normalize API response data
 * @param {Object} response - API response object
 * @returns {Object} Normalized data with exchanges and pagination
 */
export const normalizeStatsResponse = (response) => {
  // Handle different response structures
  const exchanges = response.data || response.exchanges || response.results || [];
  const pagination = response.pagination || response.meta || {};

  return { exchanges, pagination };
};
