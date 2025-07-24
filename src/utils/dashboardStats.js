/**
 * Calculate statistics from exchange data
 * @param {Array} exchanges - Array of exchange objects from API
 * @param {Object} pagination - Pagination object from API response
 * @returns {Object} Statistics object with totals
 */
export const calculateDashboardStats = (exchanges = [], pagination = {}) => {
  const total = pagination?.total || pagination?.totalCount || exchanges.length;

  // Calculate accurate queue statistics
  let totalQueues = 0; // Count of active queues (queues with consumers > 0)
  let totalMessagesSent = 0;
  let totalMessagesQueued = 0;

  exchanges.forEach((exchange) => {
    // Count active queues for this exchange (queues with consumers > 0)
    if (exchange.queues && Array.isArray(exchange.queues)) {
      exchange.queues.forEach((queue) => {
        // A queue is considered active if it has consumers
        const consumerCount = parseInt(queue.consumers) || 0;
        const queueState = queue.state;

        // Count as active if it has consumers, regardless of state
        // (consumers indicate actual usage/activity)
        if (consumerCount > 0) {
          totalQueues += 1;
        }
      });
    }

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
