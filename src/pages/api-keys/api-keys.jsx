import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Grid,
  Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { PlusOutlined, KeyOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { format } from 'date-fns';
import { apiRequest } from '../../utils/api';

const APIKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 0
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openKeyDisplayDialog, setOpenKeyDisplayDialog] = useState(false);
  const [newApiKey, setNewApiKey] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', expires_at: '' });
  const [formErrors, setFormErrors] = useState({ name: '', description: '', expires_at: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch existing API keys
  const fetchAPIKeys = useCallback(async (page = 1, pageSize = 10) => {
    try {
      setFetchLoading(true);
      const response = await apiRequest(`/auth/api-keys?page=${page}&page_size=${pageSize}`);

      // Handle the new API structure
      if (response.data) {
        setApiKeys(response.data);
        setPagination({
          page: response.pagination?.page || page,
          page_size: response.pagination?.page_size || pageSize,
          total: response.pagination?.total || response.data.length,
          total_pages: response.pagination?.total_pages || Math.ceil((response.pagination?.total || response.data.length) / pageSize)
        });
      } else {
        // Fallback for older API format
        setApiKeys(response.api_keys || response || []);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
      showSnackbar('Failed to load API keys', 'error');
    } finally {
      setFetchLoading(false);
    }
  }, []);

  // Fetch API keys on component mount
  useEffect(() => {
    fetchAPIKeys();
  }, [fetchAPIKeys]);

  // Handle pagination change
  const handlePageChange = (event, newPage) => {
    fetchAPIKeys(newPage, pagination.page_size);
  };

  // Validate form data
  const validateForm = () => {
    const errors = { name: '', description: '', expires_at: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'API key name is required';
      isValid = false;
    }

    // Validate expiry date if provided
    if (formData.expires_at) {
      const expiryDate = new Date(formData.expires_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (expiryDate <= today) {
        errors.expires_at = 'Expiry date must be in the future';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  // Create new API key
  const createAPIKey = async () => {
    if (!validateForm()) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await apiRequest('/auth/api-keys', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || undefined,
          expires_at: formData.expires_at || undefined
        })
      });

      // Store the new API key and show it in a special dialog
      setNewApiKey(response);
      setOpenKeyDisplayDialog(true);

      // Refresh the API keys list to show the new key
      await fetchAPIKeys(pagination.page, pagination.page_size);

      setFormData({ name: '', description: '', expires_at: '' });
      setFormErrors({ name: '', description: '', expires_at: '' });
      setOpenDialog(false);
    } catch (error) {
      console.error('Error creating API key:', error);

      // Extract error message based on HTTP status code
      let errorMessage = 'Error creating API key';

      if (error.message) {
        // Extract HTTP status code from error message
        const statusMatch = error.message.match(/HTTP (\d+):/);
        if (statusMatch) {
          const statusCode = parseInt(statusMatch[1]);

          // Provide user-friendly messages based on status code
          switch (statusCode) {
            case 400:
              errorMessage = 'Bad request. Please check your input and try again.';
              break;
            case 401:
              errorMessage = 'Your session has expired. Please log in again.';
              break;
            case 409:
              errorMessage = 'This API key name is already registered. Please try another one.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              // Try to extract the actual API message as fallback
              try {
                const errorMatch = error.message.match(/HTTP \d+: (.+)/);
                if (errorMatch) {
                  const jsonString = errorMatch[1];
                  const errorData = JSON.parse(jsonString);
                  errorMessage = errorData.message || errorMessage;
                }
              } catch {
                // Keep the default status-based message
              }
              break;
          }
        }
      }

      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({ name: '', description: '', expires_at: '' });
    setFormErrors({ name: '', description: '', expires_at: '' });
  };

  // Handle API key display dialog close
  const handleKeyDisplayDialogClose = () => {
    setOpenKeyDisplayDialog(false);
    setNewApiKey(null);
    showSnackbar('API key created successfully! Make sure you saved it.', 'success');
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      showSnackbar(`${label} copied successfully!`, 'success');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      showSnackbar('Failed to copy to clipboard', 'error');
    }
  };

  // Show snackbar
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Helper function to safely get field values with fallback messages
  const getFieldValue = (value, fieldName, fallback = `${fieldName} not available`) => {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    return value;
  };

  // Helper function to check if a key object has missing critical fields
  const validateKeyData = (key) => {
    const missingFields = [];
    if (!key.key_id) missingFields.push('Key ID');
    if (!key.name) missingFields.push('Name');
    // Note: API key is not returned in GET requests for security
    if (!key.created_at) missingFields.push('Created Date');
    return missingFields;
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  // Get status color based on expiry
  const getStatusColor = (expiresAt) => {
    if (!expiresAt) return 'success';
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24);

    if (daysUntilExpiry < 0) return 'error';
    if (daysUntilExpiry < 30) return 'warning';
    return 'success';
  };

  const getStatusText = (expiresAt) => {
    if (!expiresAt) return 'Never expires';
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysUntilExpiry = Math.floor((expiry - now) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry === 0) return 'Expires today';
    if (daysUntilExpiry === 1) return 'Expires tomorrow';
    if (daysUntilExpiry < 30) return `Expires in ${daysUntilExpiry} days`;
    return 'Active';
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75} sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
      <Grid size={12}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            mb: 3,
            gap: { xs: 2, md: 0 }
          }}
        >
          <Typography variant={{ xs: 'h5', md: 'h4' }} sx={{ fontWeight: 600 }}>
            API Keys
          </Typography>
          <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setOpenDialog(true)} fullWidth={{ xs: true, md: false }}>
            Create API Key
          </Button>
        </Box>
      </Grid>

      {/* API Keys Display */}
      <Grid size={12}>
        {fetchLoading ? (
          <MainCard>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Loading API keys...
              </Typography>
            </Box>
          </MainCard>
        ) : apiKeys.length === 0 ? (
          <MainCard>
            <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
              <KeyOutlined style={{ color: '#ccc', marginBottom: '16px' }} />
              <Typography variant={{ xs: 'h6', sm: 'h6' }} color="text.secondary">
                No API keys found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: { xs: 2, sm: 2 } }}>
                Create your first API key to start using the QueueDroid API
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlusOutlined />}
                sx={{ mt: 1 }}
                onClick={() => setOpenDialog(true)}
                fullWidth={{ xs: true, sm: false }}
              >
                Create API Key
              </Button>
            </Box>
          </MainCard>
        ) : (
          <MainCard>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Key ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Last Used</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiKeys.map((key) => {
                    const missingFields = validateKeyData(key);

                    return (
                      <TableRow key={key.key_id || Math.random()} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {getFieldValue(key.name, 'API Key Name')}
                            </Typography>
                            {missingFields.length > 0 && (
                              <Chip
                                label={`Missing: ${missingFields.join(', ')}`}
                                size="small"
                                color="warning"
                                sx={{ mt: 0.5, fontSize: '0.75rem' }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {getFieldValue(key.description, 'Description', 'No description')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {key.key_id ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: 200 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.75rem',
                                  backgroundColor: 'grey.50',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  flex: 1,
                                  minWidth: 0,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {key.key_id}
                              </Typography>
                              <Tooltip title="Copy Key ID">
                                <IconButton size="small" onClick={() => copyToClipboard(key.key_id, 'Key ID')}>
                                  <CopyIcon sx={{ color: 'grey', fontSize: 15 }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="error">
                              Not available
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip label={getStatusText(key.expires_at)} color={getStatusColor(key.expires_at)} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{key.created_at ? formatDate(key.created_at) : 'Date not available'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{key.last_used_at ? formatDate(key.last_used_at) : 'Never used'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{key.expires_at ? formatDate(key.expires_at) : 'Never'}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="More actions coming soon">
                            <span>
                              <Button size="small" disabled variant="outlined">
                                Manage
                              </Button>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        )}
      </Grid>

      {/* Pagination */}
      {!fetchLoading && apiKeys.length > 0 && pagination.total_pages > 1 && (
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={pagination.total_pages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
            Showing {apiKeys.length} of {pagination.total} API keys
          </Typography>
        </Grid>
      )}

      {/* Create API Key Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New API Key</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              placeholder="e.g., Production API Key"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              margin="normal"
              required
              error={!!formErrors.name}
              helperText={formErrors.name || 'Enter a descriptive name for this API key'}
            />
            <TextField
              fullWidth
              label="Description"
              placeholder="e.g., Used for production SMS sending"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              margin="normal"
              multiline
              rows={3}
              helperText="Provide a description for this API key (optional)"
            />
            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              value={formData.expires_at}
              onChange={(e) => handleInputChange('expires_at', e.target.value)}
              margin="normal"
              error={!!formErrors.expires_at}
              helperText={formErrors.expires_at || 'Set when this API key should expire (optional - leave blank for no expiry)'}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={createAPIKey} variant="contained" disabled={loading || !formData.name.trim()}>
            {loading ? <CircularProgress size={20} /> : 'Create API Key'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* API Key Display Dialog - One Time Only */}
      <Dialog open={openKeyDisplayDialog} onClose={handleKeyDisplayDialogClose} maxWidth="md" fullWidth disableEscapeKeyDown>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Alert severity="success" sx={{ flexGrow: 1, fontSize: '1rem' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                🎉 API Key Created Successfully!
              </Typography>
            </Alert>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              <strong>Important:</strong> This is the only time you will see this API key. Please copy it and store it in a safe place.
            </Typography>
            <Typography variant="body2">For security reasons, we do not store the key and cannot retrieve it later.</Typography>
          </Alert>

          {newApiKey && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                API Key Details
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Name: <strong>{newApiKey.name}</strong>
                </Typography>
                {newApiKey.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Description: {newApiKey.description}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Key ID: <strong>{newApiKey.key_id}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Expires: <strong>{newApiKey.expires_at ? formatDate(newApiKey.expires_at) : 'Never'}</strong>
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Your API Key:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  value={newApiKey.api_key}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      backgroundColor: 'success.50',
                      '& input': {
                        cursor: 'text'
                      }
                    }
                  }}
                  onClick={(e) => e.target.select()}
                />
                <Tooltip title="Copy API Key">
                  <IconButton
                    size="large"
                    onClick={() => copyToClipboard(newApiKey.api_key, 'API Key')}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark'
                      }
                    }}
                  >
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Alert severity="info">
                <Typography variant="body2">
                  💡 <strong>Tip:</strong> You can click on the API key field above to select all text for easy copying.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleKeyDisplayDialogClose} variant="contained" size="large" fullWidth>
            I've Saved My API Key
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default APIKeys;
