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
  Tooltip
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
import { EditOutlined, PlusOutlined, UndoOutlined } from '@ant-design/icons';
import { apiConfig } from '../../config/apiConfig';
import { mergeStoredQueues } from '../../utils/queuePersistence';
import { CopyOutlined } from '@ant-design/icons/lib';

export default function Exchange() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Validate form data
  const validateForm = () => {
    const errors = { label: '', description: '' };
    let isValid = true;

    if (!formData.label.trim()) {
      errors.label = 'Label is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
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

  // Fetch exchanges
  const fetchExchanges = async () => {
    try {
      setLoading(true);
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

        // Merge stored queues with exchange data
        const exchangesWithQueues = mergeStoredQueues(exchangeData);
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

        // Merge stored queues with exchange data
        const exchangesWithQueues = mergeStoredQueues(exchangeData);
        setExchanges(exchangesWithQueues);
      }
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      showSnackbar('Error fetching exchanges', 'error');
    } finally {
      setLoading(false);
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
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', aligns: 'center', mb: 3 }}>
          <Typography variant="h4">Exchange Management</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<UndoOutlined />} onClick={fetchExchanges}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => handleDialogOpen('create')}>
              Create Exchange
            </Button>
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
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No exchanges found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Create your first exchange to get started
              </Typography>
              <Button variant="contained" startIcon={<PlusOutlined />} sx={{ mt: 2 }} onClick={() => handleDialogOpen('create')}>
                Create Exchange
              </Button>
            </Box>
          </MainCard>
        ) : (
          <Grid container spacing={3}>
            {exchanges.map((exchange) => (
              <Grid size={{ xs: 12, sm: 6, md: 12 }} key={exchange.exchange_id || exchange.id}>
                <MainCard sx={{ height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {exchange.label || exchange.exchange_id}
                    </Typography>
                    {/* <IconButton sx={{ p: 0.5, color: '#000' }} size="small" onClick={(e) => handleMenuClick(e, exchange)}>
                      <MoreVertIcon />
                    </IconButton> */}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {exchange.description || 'No description'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    ID: <Chip label={`${exchange.exchange_id || exchange.id}`} size="small" />
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
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                    Created: {new Date(exchange.created_at).toLocaleDateString()}
                  </Typography>

                  {/* Queue Display - Read Only */}
                  <QueueDisplay queues={exchange.queues || []} exchangeId={exchange.exchange_id || exchange.id} />
                  
                  <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
                    <Button size="small" startIcon={<EditOutlined />} onClick={() => handleDialogOpen('edit', exchange)}>
                      Edit
                    </Button>
                    <Button size="small" startIcon={<DeleteIcon />} color="error" onClick={() => handleDialogOpen('delete', exchange)}>
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
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
                required
                error={!!formErrors.description}
                helperText={formErrors.description || 'Provide a detailed description for the exchange'}
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
            disabled={dialogType !== 'delete' && (!formData.label.trim() || !formData.description.trim())}
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
    </Grid>
  );
}
