import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Autocomplete,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Fab,
  Slide,
  Paper,
  Chip,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Message as MessageIcon,
  Minimize as MinimizeIcon,
  Crop32 as MaximizeIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { exchangeAPI, messageAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GlobalComposeMessage = ({ open, onClose, onSend }) => {
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState(['']);
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [exchangesLoading, setExchangesLoading] = useState(false);
  const [error, setError] = useState('');
  const [minimized, setMinimized] = useState(false);
  const [messageMode, setMessageMode] = useState('single'); // 'single' or 'bulk'
  const navigate = useNavigate();

  // Fetch exchanges when dialog opens
  useEffect(() => {
    if (open && exchanges.length === 0) {
      fetchExchanges();
    }
  }, [open, exchanges.length]);

  const fetchExchanges = async () => {
    try {
      setExchangesLoading(true);
      const response = await exchangeAPI.getAll(1, 100);

      let exchangesList = [];
      if (Array.isArray(response)) {
        exchangesList = response;
      } else if (response && response.results && Array.isArray(response.results)) {
        exchangesList = response.results;
      } else if (response && response.data && Array.isArray(response.data)) {
        exchangesList = response.data;
      }

      setExchanges(exchangesList);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      setError('Failed to load exchanges');
    } finally {
      setExchangesLoading(false);
    }
  };

  const handleSend = async () => {
    if (!selectedExchange || !messageContent.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (messageMode === 'single' && !phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    if (messageMode === 'bulk') {
      const validPhoneNumbers = phoneNumbers.filter((phone) => phone.trim());
      if (validPhoneNumbers.length === 0) {
        setError('Please enter at least one phone number');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');

      let response;
      let messageData;

      if (messageMode === 'single') {
        messageData = {
          content: messageContent,
          exchange_id: selectedExchange.exchange_id,
          phone_number: phoneNumber
        };
        response = await messageAPI.sendSingle(messageData);
      } else {
        const validPhoneNumbers = phoneNumbers.filter((phone) => phone.trim());
        const messages = validPhoneNumbers.map((phone) => ({
          content: messageContent,
          exchange_id: selectedExchange.exchange_id,
          phone_number: phone
        }));

        messageData = { messages };
        response = await messageAPI.sendBulk(messageData);
      }

      // Call the onSend callback if provided
      if (onSend) {
        onSend(response, messageData);
      }

      // Reset form
      setPhoneNumber('');
      setPhoneNumbers(['']);
      setMessageContent('');
      setSelectedExchange(null);
      setMessageMode('single');

      // Close dialog
      onClose();

      // Navigate to messages page to see the queued message
      navigate('logs/messages');
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber('');
    setPhoneNumbers(['']);
    setMessageContent('');
    setSelectedExchange(null);
    setError('');
    setMinimized(false);
    setMessageMode('single');
    onClose();
  };

  const handleMessageModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMessageMode(newMode);
      setError('');
    }
  };

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, '']);
  };

  const removePhoneNumber = (index) => {
    if (phoneNumbers.length > 1) {
      const newPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
      setPhoneNumbers(newPhoneNumbers);
    }
  };

  const updatePhoneNumber = (index, value) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };

  if (minimized) {
    return (
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 50,
          right: 20,
          width: 300,
          p: 2,
          zIndex: 1300,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'white',
          mb: 6
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2">Compose Message</Typography>
          <Box>
            <IconButton size="small" onClick={() => setMinimized(false)} sx={{ color: 'white', mr: 1 }}>
              <MaximizeIcon />
            </IconButton>
            <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          To: {messageMode === 'single' ? phoneNumber || 'Not set' : `${phoneNumbers.filter((p) => p.trim()).length} recipients`}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Mode: {messageMode === 'single' ? 'Single' : 'Bulk'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          position: 'fixed',
          bottom: 20,
          right: 20,
          top: 'auto',
          left: 'auto',
          m: 0,
          maxWidth: 500,
          width: '90vw',
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MessageIcon color="primary" />
            <Typography variant="h6">Compose Message</Typography>
          </Box>
          <Box>
            <IconButton size="small" onClick={() => setMinimized(true)} sx={{ mr: 1, color: 'grey' }}>
              <MinimizeIcon />
            </IconButton>
            <IconButton size="small" onClick={handleClose} sx={{ color: 'grey', mt: 1 }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {/* Message Mode Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ToggleButtonGroup value={messageMode} exclusive onChange={handleMessageModeChange} aria-label="message mode" size="small">
              <ToggleButton value="single" aria-label="single message" sx={{ color: 'grey' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Single
              </ToggleButton>
              <ToggleButton value="bulk" aria-label="bulk message" sx={{ color: 'grey' }}>
                <GroupIcon sx={{ mr: 1 }} />
                Bulk
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Exchange Selection */}
          <Autocomplete
            value={selectedExchange}
            onChange={(event, newValue) => setSelectedExchange(newValue)}
            options={exchanges}
            getOptionLabel={(option) => option.label || option.exchange_id}
            loading={exchangesLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Exchange"
                placeholder="Choose an exchange..."
                size="small"
                required
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

          {/* Phone Number Input */}
          {messageMode === 'single' ? (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Phone Number *
              </Typography>
              <Box
                sx={{
                  '& .PhoneInput': {
                    border: '1px solid #d3d4d5',
                    bgcolor: 'white',
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
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">Phone Numbers * ({phoneNumbers.filter((p) => p.trim()).length})</Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={addPhoneNumber} variant="outlined">
                  Add Number
                </Button>
              </Box>
              <Stack spacing={1}>
                {phoneNumbers.map((phone, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box
                      sx={{
                        flex: 1,
                        '& .PhoneInput': {
                          border: '1px solid #d3d4d5',
                          bgcolor: 'white',
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
                    {phoneNumbers.length > 1 && (
                      <IconButton onClick={() => removePhoneNumber(index)} color="error" size="small">
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Stack>
              {phoneNumbers.filter((p) => p.trim()).length > 0 && (
                <Chip
                  label={`${phoneNumbers.filter((p) => p.trim()).length} recipients selected`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          )}

          {/* Message Content */}
          <TextField
            label="Message"
            placeholder="Type your message here..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            multiline
            rows={4}
            required
            inputProps={{ maxLength: 1000 }}
            helperText={`${messageContent.length}/1000 characters`}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSend}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          disabled={
            loading ||
            !selectedExchange ||
            !messageContent.trim() ||
            (messageMode === 'single' && !phoneNumber) ||
            (messageMode === 'bulk' && phoneNumbers.filter((p) => p.trim()).length === 0)
          }
        >
          {messageMode === 'single' ? 'Send' : `Send to ${phoneNumbers.filter((p) => p.trim()).length} recipients`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Global Compose Button Component
export const GlobalComposeButton = ({ onMessageSent }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMessageSent = (response, messageData) => {
    if (onMessageSent) {
      onMessageSent(response, messageData);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="compose message"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 50,
          right: 20,
          zIndex: 1000
        }}
      >
        <MessageIcon />
      </Fab>

      <GlobalComposeMessage open={open} onClose={handleClose} onSend={handleMessageSent} />
    </>
  );
};

export default GlobalComposeMessage;
