const QUEUE_STORAGE_KEY = 'qdroid_exchange_queues';

/**
 * Get all queues from localStorage
 * @returns {Object} Object with exchangeId as key and queue array as value
 */
export const getStoredQueues = () => {
  try {
    const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading queues from localStorage:', error);
    return {};
  }
};

/**
 * Store queues for a specific exchange
 * @param {string} exchangeId - Exchange ID
 * @param {Array} queues - Array of queue objects
 */
export const storeExchangeQueues = (exchangeId, queues) => {
  try {
    const allQueues = getStoredQueues();
    allQueues[exchangeId] = queues;
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(allQueues));
  } catch (error) {
    console.error('Error storing queues to localStorage:', error);
  }
};

/**
 * Add a queue to an exchange
 * @param {string} exchangeId - Exchange ID
 * @param {Object} queue - Queue object to add
 */
export const addQueueToExchange = (exchangeId, queue) => {
  try {
    const allQueues = getStoredQueues();
    const exchangeQueues = allQueues[exchangeId] || [];
    exchangeQueues.push(queue);
    allQueues[exchangeId] = exchangeQueues;
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(allQueues));
  } catch (error) {
    console.error('Error adding queue to localStorage:', error);
  }
};

/**
 * Remove a queue from an exchange
 * @param {string} exchangeId - Exchange ID
 * @param {string} queueId - Queue ID to remove
 */
export const removeQueueFromExchange = (exchangeId, queueId) => {
  try {
    const allQueues = getStoredQueues();
    const exchangeQueues = allQueues[exchangeId] || [];
    allQueues[exchangeId] = exchangeQueues.filter((queue) => (queue.id || queue.queue) !== queueId);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(allQueues));
  } catch (error) {
    console.error('Error removing queue from localStorage:', error);
  }
};

/**
 * Get queues for a specific exchange
 * @param {string} exchangeId - Exchange ID
 * @returns {Array} Array of queue objects
 */
export const getExchangeQueues = (exchangeId) => {
  try {
    const allQueues = getStoredQueues();
    return allQueues[exchangeId] || [];
  } catch (error) {
    console.error('Error getting exchange queues:', error);
    return [];
  }
};

/**
 * Clear all stored queues (useful for testing or data cleanup)
 */
export const clearStoredQueues = () => {
  try {
    localStorage.removeItem(QUEUE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing stored queues:', error);
  }
};

/**
 * Merge stored queues with exchange data
 * @param {Array} exchanges - Array of exchange objects
 * @returns {Array} Exchanges with queues merged from storage
 */
export const mergeStoredQueues = (exchanges) => {
  try {
    const storedQueues = getStoredQueues();
    return exchanges.map((exchange) => {
      const exchangeId = exchange.exchange_id || exchange.id;
      const queues = storedQueues[exchangeId] || [];
      return {
        ...exchange,
        queues
      };
    });
  } catch (error) {
    console.error('Error merging stored queues:', error);
    return exchanges;
  }
};
