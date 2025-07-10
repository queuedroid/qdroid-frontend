import React, { useState, useEffect, useRef } from 'react';
// material-ui
import {
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  Autocomplete,
  IconButton,
  Chip,
  Paper,
  List,
  ListItem,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Badge,
  Stack,
  Card,
  CardContent
} from '@mui/material';
import {
  Send as SendIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  Group as GroupIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  AccessTime as ClockIcon,
  AddCircle as AddIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// project imports
import MainCard from 'components/MainCard';
import { exchangeAPI, messageAPI } from 'utils/api';

// assets
import { MessageOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';

export default function Message() {
  // State management
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [bulkPhoneNumbers, setBulkPhoneNumbers] = useState(['']);
  const [bulkMode, setBulkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exchangesLoading, setExchangesLoading] = useState(true);
  const [messageHistory, setMessageHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openBulkDialog, setOpenBulkDialog] = useState(false);

  const messageInputRef = useRef(null);

  // Load exchanges on component mount
  useEffect(() => {
    fetchExchanges();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchExchanges = async () => {
    try {
      setExchangesLoading(true);
      const response = await exchangeAPI.getAll(1, 100);
      console.log('Exchanges API response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'null/undefined');

      // Handle different possible response structures
      let exchangesList = [];
      if (Array.isArray(response)) {
        console.log('Response is array');
        exchangesList = response;
      } else if (response && response.results && Array.isArray(response.results)) {
        console.log('Response has results property');
        exchangesList = response.results;
      } else if (response && response.data && Array.isArray(response.data)) {
        console.log('Response has data property');
        exchangesList = response.data;
      } else if (response && response.exchanges && Array.isArray(response.exchanges)) {
        console.log('Response has exchanges property');
        exchangesList = response.exchanges;
      } else {
        console.warn('Unexpected API response structure:', response);
        console.warn('Available properties:', response ? Object.keys(response) : 'none');
      }

      console.log('Setting exchanges:', exchangesList);
      console.log('Exchanges count:', exchangesList.length);
      setExchanges(exchangesList);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      showSnackbar('Failed to load exchanges', 'error');
    } finally {
      setExchangesLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleExchangeChange = (event, newValue) => {
    setSelectedExchange(newValue);
    setSelectedQueue(null);
  };

  const handleQueueChange = (event, newValue) => {
    setSelectedQueue(newValue);
  };

  const addPhoneNumber = () => {
    setBulkPhoneNumbers([...bulkPhoneNumbers, '']);
  };

  const removePhoneNumber = (index) => {
    const newNumbers = bulkPhoneNumbers.filter((_, i) => i !== index);
    setBulkPhoneNumbers(newNumbers);
  };

  const updatePhoneNumber = (index, value) => {
    const newNumbers = [...bulkPhoneNumbers];
    newNumbers[index] = value;
    setBulkPhoneNumbers(newNumbers);
  };

  const handleSendMessage = async () => {
    if (!selectedExchange || !messageContent.trim()) {
      showSnackbar('Please select exchange and enter a message', 'error');
      return;
    }

    if (bulkMode) {
      const validPhoneNumbers = bulkPhoneNumbers.filter((phone) => phone.trim());
      if (validPhoneNumbers.length === 0) {
        showSnackbar('Please enter at least one phone number', 'error');
        return;
      }
      await sendBulkMessage(validPhoneNumbers);
    } else {
      if (!phoneNumber) {
        showSnackbar('Please enter a phone number', 'error');
        return;
      }
      await sendSingleMessage();
    }
  };

  const sendSingleMessage = async () => {
    try {
      setLoading(true);
      const messageData = {
        content: messageContent,
        exchange_id: selectedExchange.exchange_id,
        phone_number: phoneNumber
      };

      // Only include queue_id if a queue is selected
      if (selectedQueue) {
        messageData.queue_id = selectedQueue.id || selectedQueue.queue;
      }

      const response = await messageAPI.sendSingle(messageData);

      const newMessage = {
        id: Date.now(),
        phone: phoneNumber,
        content: messageContent,
        status: 'sent',
        timestamp: new Date(),
        type: 'single'
      };
      setMessageHistory((prev) => [newMessage, ...prev]);

      setPhoneNumber('');
      setMessageContent('');

      showSnackbar(response.message || 'Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      showSnackbar(error.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sendBulkMessage = async (phoneNumbers) => {
    try {
      setLoading(true);
      const messages = phoneNumbers.map((phone) => {
        const message = {
          content: messageContent,
          exchange_id: selectedExchange.exchange_id,
          phone_number: phone
        };

        // Only include queue_id if a queue is selected
        if (selectedQueue) {
          message.queue_id = selectedQueue.id || selectedQueue.queue;
        }

        return message;
      });

      const bulkData = { messages };
      const response = await messageAPI.sendBulk(bulkData);

      const newMessage = {
        id: Date.now(),
        phones: phoneNumbers,
        content: messageContent,
        status: 'processing',
        timestamp: new Date(),
        type: 'bulk',
        count: phoneNumbers.length
      };
      setMessageHistory((prev) => [newMessage, ...prev]);

      setBulkPhoneNumbers(['']);
      setMessageContent('');
      setOpenBulkDialog(false);

      showSnackbar(`${response.message} (${response.count} messages)` || 'Bulk messages sent successfully!');
    } catch (error) {
      console.error('Error sending bulk messages:', error);
      showSnackbar(error.response?.data?.message || 'Failed to send bulk messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const availableQueues = selectedExchange?.queues || [];

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid size={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h4">Messages</Typography>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button
              variant={!bulkMode ? 'contained' : 'outlined'}
              startIcon={<UserOutlined />}
              onClick={() => setBulkMode(false)}
              size="small"
            >
              Single
            </Button>
            <Button
              variant={bulkMode ? 'contained' : 'outlined'}
              startIcon={<TeamOutlined />}
              onClick={() => setBulkMode(true)}
              size="small"
            >
              Bulk
            </Button>
            <IconButton onClick={fetchExchanges} disabled={exchangesLoading}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
      </Grid>

      {/* Main Chat Interface */}
      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard>
          {/* Exchange and Queue Selection */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  value={selectedExchange}
                  onChange={handleExchangeChange}
                  options={exchanges}
                  getOptionLabel={(option) => option.label || option.exchange_id}
                  loading={exchangesLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Exchange"
                      placeholder="Choose an exchange..."
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {exchangesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {option.label || option.exchange_id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.description || 'No description'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  value={selectedQueue}
                  onChange={handleQueueChange}
                  options={availableQueues}
                  getOptionLabel={(option) => `+${option.country_code} (${option.mcc}-${option.mnc})`}
                  disabled={!selectedExchange || availableQueues.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Queue (Optional)"
                      placeholder="Choose a queue (optional)..."
                      size="small"
                      helperText={
                        !selectedExchange
                          ? 'Select an exchange first'
                          : availableQueues.length === 0
                            ? 'No queues available - this is optional'
                            : `${availableQueues.length} queue(s) available (optional)`
                      }
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body2">
                          +{option.country_code} ({option.country_name || 'Unknown'})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          MCC: {option.mcc} | MNC: {option.mnc}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Message History Area */}
          <Box sx={{ height: 400, overflow: 'auto', p: 2, bgcolor: '#fafafa' }}>
            {messageHistory.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'text.secondary'
                }}
              >
                <MessageIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  No messages yet
                </Typography>
                <Typography variant="body2">Send your first message to get started!</Typography>
              </Box>
            ) : (
              <List sx={{ py: 0 }}>
                {messageHistory.map((msg) => (
                  <ListItem key={msg.id} sx={{ mb: 1, alignItems: 'flex-start' }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        ml: 'auto',
                        mr: 0,
                        maxWidth: '70%',
                        bgcolor: msg.type === 'bulk' ? '#e3f2fd' : '#e8f5e9',
                        borderRadius: '18px 18px 4px 18px'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {msg.type === 'bulk' ? (
                          <Badge badgeContent={msg.count} color="primary">
                            <GroupIcon fontSize="small" />
                          </Badge>
                        ) : (
                          <PhoneIcon fontSize="small" />
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {msg.timestamp.toLocaleTimeString()}
                        </Typography>
                        <Chip
                          label={msg.status}
                          size="small"
                          color={msg.status === 'sent' ? 'success' : msg.status === 'processing' ? 'warning' : 'error'}
                          icon={msg.status === 'sent' ? <CheckIcon /> : msg.status === 'processing' ? <ClockIcon /> : <ErrorIcon />}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {msg.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        To: {msg.type === 'bulk' ? `${msg.count} recipients` : msg.phone}
                      </Typography>
                    </Paper>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Message Input Area */}
          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
            {/* Phone Number Input */}
            {!bulkMode ? (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Phone Number
                </Typography>
                <Box
                  sx={{
                    '& .PhoneInput': {
                      border: '1px solid #d3d4d5',
                      color: 'transparent',
                      borderRadius: '8px',
                      padding: '12px',
                      '&:focus-within': {
                        borderColor: '#1976d2',
                        borderWidth: '2px'
                      }
                    },
                    '& .PhoneInputInput': {
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      marginLeft: '8px'
                    }
                  }}
                >
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    defaultCountry="CM"
                    international
                  />
                </Box>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle2">Phone Numbers ({bulkPhoneNumbers.filter((p) => p.trim()).length})</Typography>
                  <Button size="small" startIcon={<GroupIcon />} onClick={() => setOpenBulkDialog(true)} variant="outlined">
                    Manage Bulk
                  </Button>
                </Box>
                <Chip
                  sx={{ p: 3 }}
                  label={`${bulkPhoneNumbers.filter((p) => p.trim()).length} recipients selected`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}

            {/* Message Content Input */}
            <Box sx={{ position: 'relative' }}>
              <TextField
                ref={messageInputRef}
                fullWidth
                multiline
                minRows={3}
                maxRows={6}
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    pr: 8
                  }
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  display: 'flex',
                  gap: 1
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                  {messageContent.length}/1000
                </Typography>
                <Button
                  variant="contained"
                  endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                  onClick={handleSendMessage}
                  disabled={loading || !selectedExchange || !messageContent.trim()}
                  sx={{ borderRadius: '8px' }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Box>
        </MainCard>
      </Grid>

      {/* Sidebar */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={2}>
          {/* Quick Stats */}
          <MainCard>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {messageHistory.filter((m) => m.status === 'sent').length}
                  </Typography>
                  <Typography variant="caption">Sent</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {messageHistory.filter((m) => m.status === 'processing').length}
                  </Typography>
                  <Typography variant="caption">Processing</Typography>
                </Box>
              </Grid>
            </Grid>
          </MainCard>

          {/* Selected Exchange Info */}
          {selectedExchange && (
            <MainCard>
              <Typography variant="h6" gutterBottom>
                Exchange Details
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">{selectedExchange.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedExchange.description || 'No description'}
                </Typography>
              </Box>
              <Chip label={`ID: ${selectedExchange.exchange_id}`} size="small" variant="outlined" />
            </MainCard>
          )}

          {/* Selected Queue Info */}
          {selectedQueue && (
            <MainCard>
              <Typography variant="h6" gutterBottom>
                Queue Details
              </Typography>
              <Stack spacing={1}>
                <Chip label={`Country: +${selectedQueue.country_code}`} size="small" />
                <Chip label={`MCC: ${selectedQueue.mcc}`} size="small" />
                <Chip label={`MNC: ${selectedQueue.mnc}`} size="small" />
              </Stack>
            </MainCard>
          )}

          {/* Info Card when no queue is selected */}
          {selectedExchange && !selectedQueue && (
            <MainCard>
              <Typography variant="h6" gutterBottom>
                Queue Selection
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Queue selection is optional. Messages will be sent using the default queue for the selected exchange.
              </Typography>
              <Chip label="Using default queue" size="small" variant="outlined" color="info" />
            </MainCard>
          )}
        </Stack>
      </Grid>

      {/* Bulk Phone Numbers Dialog */}
      <Dialog open={openBulkDialog} onClose={() => setOpenBulkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon />
            Manage Bulk Phone Numbers
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {bulkPhoneNumbers.map((phone, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                <Box
                  sx={{
                    flex: 1,
                    '& .PhoneInput': {
                      border: '1px solid #d3d4d5',
                      color: 'transparent',
                      borderRadius: '8px',
                      padding: '12px',
                      '&:focus-within': {
                        borderColor: '#1976d2',
                        borderWidth: '2px'
                      }
                    },
                    '& .PhoneInputInput': {
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      marginLeft: '8px'
                    }
                  }}
                >
                  <PhoneInput
                    placeholder={`Phone number ${index + 1}`}
                    value={phone}
                    onChange={(value) => updatePhoneNumber(index, value)}
                    defaultCountry="CM"
                    international
                  />
                </Box>
                {bulkPhoneNumbers.length > 1 && (
                  <IconButton onClick={() => removePhoneNumber(index)} color="error" size="small">
                    <ClearIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addPhoneNumber} variant="outlined" size="small">
              Add Phone Number
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkDialog(false)}>Cancel</Button>
          <Button
            onClick={() => setOpenBulkDialog(false)}
            variant="contained"
            disabled={bulkPhoneNumbers.filter((p) => p.trim()).length === 0}
          >
            Done ({bulkPhoneNumbers.filter((p) => p.trim()).length})
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
