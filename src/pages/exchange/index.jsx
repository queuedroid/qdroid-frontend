// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Tooltip,
  Switch,
  FormControlLabel,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import MainCard from 'components/MainCard';
import QueueDisplay from 'components/QueueDisplay';
import DeviceLinkDialog from 'components/DeviceLinkDialog';
import { EditOutlined, PlusOutlined, UndoOutlined, LinkOutlined } from '@ant-design/icons';
import { apiConfig } from '../../config/apiConfig';
import { CopyOutlined } from '@ant-design/icons/lib';

export default function Exchange() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backgroundRefreshing, setBackgroundRefreshing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [dialogType, setDialogType] = useState('create'); // create, edit, delete
  const [formData, setFormData] = useState({ label: '', description: '' });
  const [formErrors, setFormErrors] = useState({ label: '', description: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalExchanges, setTotalExchanges] = useState(0);
  const [queuePages, setQueuePages] = useState({}); // Track current page for each exchange
  const [queuePageSize] = useState(5); // Smaller page size for queues

  // Device Link Dialog state
  const [deviceLinkOpen, setDeviceLinkOpen] = useState(false);
  const [deviceLinkExchange, setDeviceLinkExchange] = useState(null);
  const [deviceLinkQueue, setDeviceLinkQueue] = useState(null);

  // Queue action dialog state
  const [queueActionDialog, setQueueActionDialog] = useState({
    open: false,
    type: '', // 'delete' or 'purge'
    queue: null,
    exchange: null
  });

  // Auto-refresh state
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [refreshIntervalDuration, setRefreshIntervalDuration] = useState(10); // Default to 10 seconds

  // Validate form data
  const validateForm = () => {
    const errors = { label: '', description: '' };
    let isValid = true;

    if (!formData.label.trim()) {
      errors.label = 'Label is required';
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  // Copy to clipboard function
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showSnackbar('Exchange ID copied to clipboard', 'success');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      showSnackbar('Failed to copy to clipboard', 'error');
    }
  };

  // Fetch exchanges and their queues
  const fetchExchanges = async (isBackgroundRefresh = false) => {
    try {
      if (isBackgroundRefresh) {
        setBackgroundRefreshing(true);
      } else {
        setLoading(true);
      }
      console.log('Fetching exchanges from API...');
      const response = await apiConfig.exchanges.getAll(page, pageSize);
      console.log('API Response:', response);

      // Check if response is a Response object (fetch API)
      if (response && typeof response.json === 'function') {
        const data = await response.json();
        console.log('Parsed JSON data:', data);

        // Handle the actual server response structure
        let exchangeData;
        if (data.data) {
          exchangeData = data.data || [];
          setTotalExchanges(data.pagination?.total || 0);
        } else {
          // Fallback for different response structure
          exchangeData = data.exchanges || [];
          setTotalExchanges(data.total || 0);
        }

        // Fetch queues for each exchange
        const exchangesWithQueues = await Promise.all(
          exchangeData.map(async (exchange) => {
            try {
              const exchangeId = exchange.exchange_id || exchange.id;
              const queuePage = queuePages[exchangeId] || 1;
              console.log(`Fetching queues for exchange ${exchangeId}, page ${queuePage}...`);
              const queuesResponse = await apiConfig.exchanges.getQueues(exchangeId, queuePage, queuePageSize);

              return {
                ...exchange,
                queues: queuesResponse.data || [],
                totalQueues: queuesResponse.pagination?.total || queuesResponse.total || 0,
                queuePage: queuePage
              };
            } catch (error) {
              console.error(`Error fetching queues for exchange ${exchange.exchange_id || exchange.id}:`, error);
              return {
                ...exchange,
                queues: [], // Return empty array if queue fetching fails
                totalQueues: 0,
                queuePage: 1
              };
            }
          })
        );

        setExchanges(exchangesWithQueues);
      } else {
        // Response is already parsed JSON
        console.log('Direct JSON data:', response);
        let exchangeData;
        if (response.data) {
          exchangeData = response.data || [];
          setTotalExchanges(response.pagination?.total || 0);
        } else {
          exchangeData = response.exchanges || [];
          setTotalExchanges(response.total || 0);
        }

        // Fetch queues for each exchange
        const exchangesWithQueues = await Promise.all(
          exchangeData.map(async (exchange) => {
            try {
              const exchangeId = exchange.exchange_id || exchange.id;
              const queuePage = queuePages[exchangeId] || 1;
              console.log(`Fetching queues for exchange ${exchangeId}, page ${queuePage}...`);
              const queuesResponse = await apiConfig.exchanges.getQueues(exchangeId, queuePage, queuePageSize);

              return {
                ...exchange,
                queues: queuesResponse.data || [],
                totalQueues: queuesResponse.pagination?.total || queuesResponse.total || 0,
                queuePage: queuePage
              };
            } catch (error) {
              console.error(`Error fetching queues for exchange ${exchange.exchange_id || exchange.id}:`, error);
              return {
                ...exchange,
                queues: [], // Return empty array if queue fetching fails
                totalQueues: 0,
                queuePage: 1
              };
            }
          })
        );

        setExchanges(exchangesWithQueues);
      }
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      showSnackbar('Error fetching exchanges', 'error');
    } finally {
      if (isBackgroundRefresh) {
        setBackgroundRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Create exchange
  const createExchange = async () => {
    if (!validateForm()) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    try {
      await apiConfig.exchanges.create(formData);
      showSnackbar('Exchange created successfully', 'success');
      setOpenDialog(false);
      fetchExchanges();
      setFormData({ label: '', description: '' });
      setFormErrors({ label: '', description: '' });
    } catch (error) {
      console.error('Error creating exchange:', error);
      showSnackbar('Error creating exchange', 'error');
    }
  };

  // Update exchange
  const updateExchange = async () => {
    if (!validateForm()) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    try {
      const exchangeId = selectedExchange.exchange_id || selectedExchange.id;
      await apiConfig.exchanges.update(exchangeId, formData);
      showSnackbar('Exchange updated successfully', 'success');
      setOpenDialog(false);
      fetchExchanges();
      setFormData({ label: '', description: '' });
      setFormErrors({ label: '', description: '' });
    } catch (error) {
      console.error('Error updating exchange:', error);
      showSnackbar('Error updating exchange', 'error');
    }
  };

  // Delete exchange
  const deleteExchange = async () => {
    try {
      const exchangeId = selectedExchange.exchange_id || selectedExchange.id;
      await apiConfig.exchanges.delete(exchangeId);
      showSnackbar('Exchange deleted successfully', 'success');
      setOpenDialog(false);
      fetchExchanges();
    } catch (error) {
      console.error('Error deleting exchange:', error);
      showSnackbar('Error deleting exchange', 'error');
    }
  };

  // Handle device link dialog
  const handleDeviceLinkOpen = (exchange, queue = null) => {
    setDeviceLinkExchange(exchange);
    setDeviceLinkQueue(queue);
    setDeviceLinkOpen(true);
  };

  const handleDeviceLinkClose = () => {
    setDeviceLinkOpen(false);
    setDeviceLinkExchange(null);
    setDeviceLinkQueue(null);
  };

  // Handle queue delete
  const handleQueueDelete = (exchange, queue) => {
    setQueueActionDialog({
      open: true,
      type: 'delete',
      queue,
      exchange
    });
  };

  // Handle queue purge
  const handleQueuePurge = (exchange, queue) => {
    setQueueActionDialog({
      open: true,
      type: 'purge',
      queue,
      exchange
    });
  };

  // Execute queue action
  const executeQueueAction = async () => {
    const { type, queue, exchange } = queueActionDialog;

    try {
      if (type === 'delete') {
        await apiConfig.exchanges.deleteQueue(exchange.exchange_id || exchange.id, queue.name || queue.id);
        showSnackbar('Queue deleted successfully', 'success');
      } else if (type === 'purge') {
        await apiConfig.exchanges.purgeQueue(exchange.exchange_id || exchange.id, queue.name || queue.id);
        showSnackbar('Queue purged successfully', 'success');
      }

      // Refresh the queues for this exchange
      await refreshQueuesForExchange(exchange.exchange_id || exchange.id);
    } catch (error) {
      console.error(`Error ${type}ing queue:`, error);
      
      // Handle specific errors
      if (error.message && error.message.includes('405')) {
        if (type === 'purge') {
          showSnackbar('Queue purge feature is not yet available on the server', 'warning');
        } else {
          showSnackbar(`Queue ${type} feature is not available`, 'warning');
        }
      } else {
        showSnackbar(`Error ${type}ing queue: ${error.message || 'Unknown error'}`, 'error');
      }
    } finally {
      setQueueActionDialog({ open: false, type: '', queue: null, exchange: null });
    }
  };

  // Close queue action dialog
  const closeQueueActionDialog = () => {
    setQueueActionDialog({ open: false, type: '', queue: null, exchange: null });
  };

  // Refresh queues for a specific exchange
  const refreshQueuesForExchange = async (exchangeId, isBackgroundRefresh = false) => {
    try {
      const currentPage = queuePages[exchangeId] || 1;
      console.log(`Refreshing queues for exchange ${exchangeId}, page ${currentPage}...`);
      const queuesResponse = await apiConfig.exchanges.getQueues(exchangeId, currentPage, queuePageSize);

      // Update the specific exchange with new queue data
      setExchanges((prevExchanges) =>
        prevExchanges.map((exchange) =>
          exchange.exchange_id === exchangeId || exchange.id === exchangeId
            ? {
                ...exchange,
                queues: queuesResponse.data || [],
                totalQueues: queuesResponse.pagination?.total || queuesResponse.total || 0
              }
            : exchange
        )
      );

      if (!isBackgroundRefresh) {
        showSnackbar('Queues refreshed successfully', 'success');
      }
    } catch (error) {
      console.error(`Error refreshing queues for exchange ${exchangeId}:`, error);
      if (!isBackgroundRefresh) {
        showSnackbar('Error refreshing queues', 'error');
      }
    }
  };

  // Handle queue page change for a specific exchange
  const handleQueuePageChange = async (exchangeId, newPage) => {
    try {
      // Update the queue page for this exchange
      setQueuePages((prev) => ({ ...prev, [exchangeId]: newPage }));

      console.log(`Changing queue page for exchange ${exchangeId} to page ${newPage}...`);
      const queuesResponse = await apiConfig.exchanges.getQueues(exchangeId, newPage, queuePageSize);

      // Update the specific exchange with new queue data
      setExchanges((prevExchanges) =>
        prevExchanges.map((exchange) =>
          exchange.exchange_id === exchangeId || exchange.id === exchangeId
            ? {
                ...exchange,
                queues: queuesResponse.data || [],
                queuePage: newPage
              }
            : exchange
        )
      );
    } catch (error) {
      console.error(`Error changing queue page for exchange ${exchangeId}:`, error);
      showSnackbar('Error loading queue page', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDialogOpen = (type, exchange = null) => {
    setDialogType(type);
    setSelectedExchange(exchange);
    if (type === 'edit' && exchange) {
      setFormData({ label: exchange.label || '', description: exchange.description || '' });
    } else {
      setFormData({ label: '', description: '' });
    }
    setFormErrors({ label: '', description: '' }); // Clear errors when opening dialog
    setOpenDialog(true);
  };

  const handleMenuClick = (event, exchange) => {
    setAnchorEl(event.currentTarget);
    setSelectedExchange(exchange);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedExchange(null);
  };

  const handleSubmit = () => {
    if (dialogType === 'create') {
      createExchange();
    } else if (dialogType === 'edit') {
      updateExchange();
    } else if (dialogType === 'delete') {
      deleteExchange();
    }
  };

  // Clear form errors when user types
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, [page, queuePages]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefreshEnabled) {
      const interval = setInterval(() => {
        console.log(`Auto-refreshing exchanges and queues every ${refreshIntervalDuration}s...`);
        fetchExchanges(true); // Pass true for background refresh
      }, refreshIntervalDuration * 1000); // Convert seconds to milliseconds

      setRefreshInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefreshEnabled, refreshIntervalDuration]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

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
            Exchange Management
            {backgroundRefreshing && (
              <CircularProgress
                size={16}
                sx={{
                  ml: 1,
                  color: 'text.secondary',
                  opacity: 0.6
                }}
                thickness={3}
              />
            )}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, md: 2 },
              alignItems: { xs: 'stretch', sm: 'center' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefreshEnabled}
                    onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-track': {
                        backgroundColor: autoRefreshEnabled ? undefined : 'rgba(0, 0, 0, 0.12)'
                      }
                    }}
                  />
                }
                label="Auto-refresh"
                sx={{
                  mr: 1,
                  '& .MuiFormControlLabel-label': {
                    color: autoRefreshEnabled ? 'text.primary' : 'text.secondary',
                    fontWeight: autoRefreshEnabled ? 500 : 400
                  }
                }}
              />
              {autoRefreshEnabled && (
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <Select
                    value={refreshIntervalDuration}
                    onChange={(e) => setRefreshIntervalDuration(e.target.value)}
                    displayEmpty
                    sx={{
                      '& .MuiSelect-select': {
                        paddingY: 0.5,
                        fontSize: '0.875rem',
                        color: '#666',
                        backgroundColor: '#f5f5f5'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ccc'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#999'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#666'
                      }
                    }}
                  >
                    <MenuItem value={5}>5s</MenuItem>
                    <MenuItem value={10}>10s</MenuItem>
                    <MenuItem value={15}>15s</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' }
              }}
            >
              <Button
                size="small"
                variant="outlined"
                startIcon={<UndoOutlined />}
                onClick={() => fetchExchanges(true)}
                disabled={backgroundRefreshing}
                fullWidth={{ xs: true, sm: false }}
              >
                {backgroundRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<PlusOutlined />}
                onClick={() => handleDialogOpen('create')}
                fullWidth={{ xs: true, sm: false }}
              >
                Create Exchange
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Exchanges Grid */}
      <Grid size={12}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : exchanges.length === 0 ? (
          <MainCard>
            <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
              <Typography variant={{ xs: 'h6', sm: 'h6' }} color="text.secondary">
                No exchanges found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: { xs: 2, sm: 2 } }}>
                Create your first exchange to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlusOutlined />}
                sx={{ mt: 1 }}
                onClick={() => handleDialogOpen('create')}
                fullWidth={{ xs: true, sm: false }}
              >
                Create Exchange
              </Button>
            </Box>
          </MainCard>
        ) : (
          <Grid container spacing={3}>
            {exchanges.map((exchange) => (
              <Grid size={{ xs: 12 }} key={exchange.exchange_id || exchange.id}>
                <MainCard sx={{ height: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'stretch', sm: 'flex-start' },
                      mb: 2,
                      gap: { xs: 1, sm: 0 }
                    }}
                  >
                    <Typography variant={{ xs: 'h6', sm: 'h5' }} component="h2" sx={{ fontWeight: 700, mb: { xs: 1, sm: 0 } }}>
                      {exchange.label || exchange.exchange_id}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<LinkOutlined />}
                      onClick={() => handleDeviceLinkOpen(exchange)}
                      fullWidth={{ xs: true, sm: false }}
                      sx={{
                        ml: { xs: 0, sm: 2 },
                        flexShrink: 0,
                        borderColor: '#ee5a52',
                        color: '#ee5a52',
                        '&:hover': {
                          borderColor: '#d84b43',
                          backgroundColor: 'rgba(238, 85, 82, 0.04)'
                        }
                      }}
                    >
                      Link Device
                    </Button>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {exchange.description || 'No description'}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 1,
                      mb: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        ID:
                      </Typography>
                      <Chip sx={{ bgcolor: '#f7e8e4' }} label={`${exchange.exchange_id || exchange.id}`} size="small" />
                      <Tooltip title="Copy Exchange ID">
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(exchange.exchange_id || exchange.id)}
                          sx={{ p: 0.5, color: '#000' }}
                        >
                          <CopyOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Created at: {new Date(exchange.created_at).toLocaleDateString()}
                  </Typography>

                  {/* Queue Display - Read Only */}
                  <QueueDisplay
                    queues={exchange.queues || []}
                    totalQueues={exchange.totalQueues || 0}
                    currentPage={exchange.queuePage || 1}
                    pageSize={queuePageSize}
                    exchangeId={exchange.exchange_id || exchange.id}
                    onRefresh={() => refreshQueuesForExchange(exchange.exchange_id || exchange.id)}
                    onPageChange={(newPage) => handleQueuePageChange(exchange.exchange_id || exchange.id, newPage)}
                    onQueueLinkDevice={(queue) => handleDeviceLinkOpen(exchange, queue)}
                    onQueueDelete={(queue) => handleQueueDelete(exchange, queue)}
                    onQueuePurge={(queue) => handleQueuePurge(exchange, queue)}
                  />

                  <Box
                    sx={{
                      //display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 1 },
                      pt: 1
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={<EditOutlined />}
                      onClick={() => handleDialogOpen('edit', exchange)}
                      fullWidth={{ xs: true, sm: false }}
                      sx={{ flex: { sm: 1 } }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => handleDialogOpen('delete', exchange)}
                      fullWidth={{ xs: true, sm: false }}
                      sx={{ flex: { sm: 1 } }}
                    >
                      Delete
                    </Button>
                  </Box>
                </MainCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleDialogOpen('edit', selectedExchange);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDialogOpen('delete', selectedExchange);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create/Edit/Delete Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            margin: 2,
            maxHeight: 'calc(100% - 64px)'
          }
        }}
      >
        <DialogTitle>
          {dialogType === 'create' && 'Create Exchange'}
          {dialogType === 'edit' && 'Edit Exchange'}
          {dialogType === 'delete' && 'Delete Exchange'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'delete' ? (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Are you sure you want to delete this exchange? This action cannot be undone.
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Label"
                placeholder="E.g: New OTP Messages"
                value={formData.label}
                onChange={(e) => handleInputChange('label', e.target.value)}
                margin="normal"
                required
                error={!!formErrors.label}
                helperText={formErrors.label || 'Enter a descriptive label for the exchange'}
              />
              <TextField
                fullWidth
                label="Description"
                placeholder="E.g: This exchange handles new OTP messages."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                margin="normal"
                multiline
                rows={3}
                error={!!formErrors.description}
                helperText={formErrors.description || 'Provide a description for the exchange (optional)'}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color={dialogType === 'delete' ? 'error' : 'primary'}
            disabled={dialogType !== 'delete' && !formData.label.trim()}
          >
            {dialogType === 'create' && 'Create'}
            {dialogType === 'edit' && 'Update'}
            {dialogType === 'delete' && 'Delete'}
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

      {/* Queue Action Confirmation Dialog */}
      <Dialog
        open={queueActionDialog.open}
        onClose={closeQueueActionDialog}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            margin: 2,
            maxHeight: 'calc(100% - 64px)'
          }
        }}
      >
        <DialogTitle>
          {queueActionDialog.type === 'delete' && 'Delete Queue'}
          {queueActionDialog.type === 'purge' && 'Purge Queue'}
        </DialogTitle>
        <DialogContent>
          {queueActionDialog.type === 'delete' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Are you sure you want to permanently delete the queue "<strong>{queueActionDialog.queue?.name}</strong>"? This will remove the
              queue and all its messages. This action cannot be undone.
            </Alert>
          )}
          {queueActionDialog.type === 'purge' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Are you sure you want to purge all messages from the queue "<strong>{queueActionDialog.queue?.name}</strong>"? This will
              remove all messages but keep the queue. This action cannot be undone.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeQueueActionDialog}>Cancel</Button>
          <Button onClick={executeQueueAction} variant="contained" color={queueActionDialog.type === 'delete' ? 'error' : 'warning'}>
            {queueActionDialog.type === 'delete' && 'Delete Queue'}
            {queueActionDialog.type === 'purge' && 'Purge Messages'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Device Link Dialog */}
      <DeviceLinkDialog open={deviceLinkOpen} onClose={handleDeviceLinkClose} exchange={deviceLinkExchange} queue={deviceLinkQueue} />
    </Grid>
  );
}
