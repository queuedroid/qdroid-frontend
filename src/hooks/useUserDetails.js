import { useState, useCallback } from 'react';
import axios from 'axios';
import { getApiBaseUrl } from '../config/apiConfig';

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState({
    account_id: '',
    account_token: '',
    email: '',
    phone_number: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${getApiBaseUrl()}/users/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('User details response:', response.data);

      if (response.data) {
        setUserDetails({
          account_id: response.data.account_id || '',
          account_token: response.data.account_token || '',
          email: response.data.email || '',
          phone_number: response.data.phone_number || '',
          full_name: response.data.full_name || ''
        });
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    userDetails,
    loading,
    error,
    fetchUserDetails
  };
};
