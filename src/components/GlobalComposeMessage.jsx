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
  ToggleButtonGroup,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
  Remove as RemoveIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon
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
  const [messageGroups, setMessageGroups] = useState([{ phoneNumbers: [''], message: '' }]);
  const [loading, setLoading] = useState(false);
  const [exchangesLoading, setExchangesLoading] = useState(false);
  const [error, setError] = useState('');
  const [minimized, setMinimized] = useState(false);
  const [messageMode, setMessageMode] = useState('single'); // 'single' or 'bulk'
  const [bulkInputMethod, setBulkInputMethod] = useState('manual'); // 'manual' or 'csv'
  const [bulkMessageMode, setBulkMessageMode] = useState('single'); // 'single' or 'multiple' for bulk messages
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [csvError, setCsvError] = useState('');
  const [csvHasContentColumn, setCsvHasContentColumn] = useState(false);
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

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }

    // Add the last field
    result.push(current.trim());
    return result;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCsvError('');

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setCsvError('Please select a valid CSV file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setCsvError('File size must be less than 5MB');
      return;
    }

    setCsvFile(file);

    // Preview CSV content
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        const previewLines = lines.slice(0, 6); // Show first 5 rows + header

        const preview = previewLines
          .filter((line) => line.trim())
          .map((line) => {
            // Use improved CSV parsing to handle quoted values
            return parseCSVLine(line);
          });

        if (preview.length === 0) {
          setCsvError('CSV file appears to be empty');
          return;
        }

        // Validate CSV structure - should have at least phone_number column
        const header = preview[0];
        const phoneColumnIndex = header.findIndex(
          (col) => col.toLowerCase().includes('phone') || col.toLowerCase().includes('number') || col.toLowerCase().includes('mobile')
        );

        const contentColumnIndex = header.findIndex(
          (col) => col.toLowerCase().includes('content') || col.toLowerCase().includes('message')
        );

        if (phoneColumnIndex === -1) {
          setCsvError('CSV must contain a column with phone numbers (e.g., "phone_number", "phone", "mobile")');
          return;
        }

        // Set whether CSV has content column
        setCsvHasContentColumn(contentColumnIndex !== -1);

        setCsvPreview(preview);
      } catch (error) {
        setCsvError('Error reading CSV file: ' + error.message);
      }
    };

    reader.readAsText(file);
  };

  const removeCSVFile = () => {
    setCsvFile(null);
    setCsvPreview([]);
    setCsvError('');
    setCsvHasContentColumn(false);
    // Reset file input
    const fileInput = document.getElementById('csv-file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSend = async () => {
    if (!selectedExchange) {
      setError('Please select an exchange');
      return;
    }

    // Check message content requirement - skip if CSV upload or multiple message mode
    const messageContentRequired =
      !(messageMode === 'bulk' && bulkInputMethod === 'csv') &&
      !(messageMode === 'bulk' && bulkInputMethod === 'manual' && bulkMessageMode === 'multiple');
    if (messageContentRequired && !messageContent.trim()) {
      setError('Please enter a message');
      return;
    }

    if (messageMode === 'single' && !phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    if (messageMode === 'bulk') {
      if (bulkInputMethod === 'manual') {
        if (bulkMessageMode === 'single') {
          const validPhoneNumbers = phoneNumbers.filter((phone) => phone.trim());
          if (validPhoneNumbers.length === 0) {
            setError('Please enter at least one phone number');
            return;
          }
        } else {
          // Multiple messages mode - validate each group
          let hasValidGroup = false;
          for (const group of messageGroups) {
            const validPhones = group.phoneNumbers.filter((phone) => phone.trim());
            if (validPhones.length > 0 && group.message.trim()) {
              hasValidGroup = true;
              break;
            }
          }
          if (!hasValidGroup) {
            setError('Please enter at least one phone number and message in each group');
            return;
          }
        }
      } else if (bulkInputMethod === 'csv') {
        if (!csvFile) {
          setError('Please select a CSV file');
          return;
        }
        if (csvError) {
          setError('Please fix CSV file errors before sending');
          return;
        }
        if (!csvHasContentColumn) {
          setError('CSV file must contain a content/message column for bulk messaging');
          return;
        }
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
      } else if (messageMode === 'bulk' && bulkInputMethod === 'manual') {
        let messages = [];

        if (bulkMessageMode === 'single') {
          // Single message to all phone numbers
          const validPhoneNumbers = phoneNumbers.filter((phone) => phone.trim());
          messages = validPhoneNumbers.map((phone) => ({
            content: messageContent,
            exchange_id: selectedExchange.exchange_id,
            phone_number: phone
          }));
        } else {
          // Multiple messages - each group has its own message
          for (const group of messageGroups) {
            const validPhones = group.phoneNumbers.filter((phone) => phone.trim());
            if (validPhones.length > 0 && group.message.trim()) {
              const groupMessages = validPhones.map((phone) => ({
                content: group.message,
                exchange_id: selectedExchange.exchange_id,
                phone_number: phone
              }));
              messages.push(...groupMessages);
            }
          }
        }

        messageData = { messages };
        response = await messageAPI.sendBulk(messageData);
      } else if (messageMode === 'bulk' && bulkInputMethod === 'csv') {
        // CSV file upload - messages are in the CSV file
        response = await messageAPI.sendBulkCSV(csvFile, selectedExchange.exchange_id, '');
        messageData = {
          file: csvFile.name,
          exchange_id: selectedExchange.exchange_id,
          content: 'Individual messages from CSV file'
        };
      }

      // Call the onSend callback if provided
      if (onSend) {
        onSend(response, messageData);
      }

      // Reset form
      setPhoneNumber('');
      setPhoneNumbers(['']);
      setMessageContent('');
      setMessageGroups([{ phoneNumbers: [''], message: '' }]);
      setSelectedExchange(null);
      setMessageMode('single');
      setBulkInputMethod('manual');
      setBulkMessageMode('single');
      removeCSVFile();

      // Close dialog
      onClose();

      // Navigate to messages page to see the queued message
      navigate('logs/messages');
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber('');
    setPhoneNumbers(['']);
    setMessageContent('');
    setMessageGroups([{ phoneNumbers: [''], message: '' }]);
    setSelectedExchange(null);
    setError('');
    setMinimized(false);
    setMessageMode('single');
    setBulkInputMethod('manual');
    setBulkMessageMode('single');
    removeCSVFile();
    onClose();
  };

  const handleMessageModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMessageMode(newMode);
      setError('');
      // Reset bulk input method when switching modes
      if (newMode === 'single') {
        setBulkInputMethod('manual');
        removeCSVFile();
      }
    }
  };

  const handleBulkInputMethodChange = (event) => {
    const newMethod = event.target.value;
    setBulkInputMethod(newMethod);
    setBulkMessageMode('single'); // Reset to single message mode
    setError('');
    if (newMethod === 'manual') {
      removeCSVFile();
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

  // Message group functions for multi-message bulk messaging
  const addMessageGroup = () => {
    setMessageGroups([...messageGroups, { phoneNumbers: [''], message: '' }]);
  };

  const removeMessageGroup = (groupIndex) => {
    if (messageGroups.length > 1) {
      const newGroups = messageGroups.filter((_, i) => i !== groupIndex);
      setMessageGroups(newGroups);
    }
  };

  const updateMessageGroupMessage = (groupIndex, message) => {
    const newGroups = [...messageGroups];
    newGroups[groupIndex].message = message;
    setMessageGroups(newGroups);
  };

  const addPhoneNumberToGroup = (groupIndex) => {
    const newGroups = [...messageGroups];
    newGroups[groupIndex].phoneNumbers.push('');
    setMessageGroups(newGroups);
  };

  const removePhoneNumberFromGroup = (groupIndex, phoneIndex) => {
    const newGroups = [...messageGroups];
    if (newGroups[groupIndex].phoneNumbers.length > 1) {
      newGroups[groupIndex].phoneNumbers = newGroups[groupIndex].phoneNumbers.filter((_, i) => i !== phoneIndex);
      setMessageGroups(newGroups);
    }
  };

  const updatePhoneNumberInGroup = (groupIndex, phoneIndex, value) => {
    const newGroups = [...messageGroups];
    newGroups[groupIndex].phoneNumbers[phoneIndex] = value;
    setMessageGroups(newGroups);
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
          To:{' '}
          {messageMode === 'single'
            ? phoneNumber || 'Not set'
            : bulkInputMethod === 'csv'
              ? csvFile
                ? `CSV: ${csvFile.name}`
                : 'No CSV file'
              : bulkMessageMode === 'single'
                ? `${phoneNumbers.filter((p) => p.trim()).length} recipients`
                : `${messageGroups.reduce((total, group) => total + group.phoneNumbers.filter((p) => p.trim()).length, 0)} recipients (${messageGroups.length} groups)`}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Mode:{' '}
          {messageMode === 'single'
            ? 'Single'
            : `Bulk (${bulkInputMethod}${bulkInputMethod === 'manual' && bulkMessageMode === 'multiple' ? ' - Multiple Messages' : ''})`}
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
                    bgcolor: '#fff',
                    borderRadius: '8px',
                    padding: '12px',
                    '&:focus-within': {
                      borderColor: '#1976d2',
                      borderWidth: '2px',
                      bgcolor: 'white'
                    }
                  },
                  '& .PhoneInputInput': {
                    border: 'none',
                    bgcolor: '#fff',
                    color: '#333',
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
              {/* Bulk Input Method Selection */}
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 1 }}>
                  How would you like to add recipients? *
                </FormLabel>
                <RadioGroup value={bulkInputMethod} onChange={handleBulkInputMethodChange} row>
                  <FormControlLabel value="manual" control={<Radio size="small" />} label="Manual Input" />
                  <FormControlLabel value="csv" control={<Radio size="small" />} label="CSV Upload" />
                </RadioGroup>
              </FormControl>

              {bulkInputMethod === 'manual' ? (
                <>
                  {/* Message Mode Selection for Manual Bulk */}
                  <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <FormLabel component="legend" sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 1 }}>
                      Message Configuration
                    </FormLabel>
                    <RadioGroup value={bulkMessageMode} onChange={(e) => setBulkMessageMode(e.target.value)} row>
                      <FormControlLabel value="single" control={<Radio size="small" />} label="Same message for all recipients" />
                      <FormControlLabel value="multiple" control={<Radio size="small" />} label="Different messages" />
                    </RadioGroup>
                  </FormControl>

                  {bulkMessageMode === 'single' ? (
                    <>
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
                                  bgcolor: '#fff',
                                  color: '#333',
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
                    </>
                  ) : (
                    <>
                      {/* Multiple Messages Mode */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2">Message Groups</Typography>
                        <Button size="small" startIcon={<AddIcon />} onClick={addMessageGroup} variant="outlined">
                          Add Message Group
                        </Button>
                      </Box>
                      <Stack spacing={2}>
                        {messageGroups.map((group, groupIndex) => (
                          <Paper key={groupIndex} variant="outlined" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="subtitle2" color="primary">
                                Group {groupIndex + 1}
                              </Typography>
                              {messageGroups.length > 1 && (
                                <IconButton onClick={() => removeMessageGroup(groupIndex)} color="error" size="small">
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </Box>

                            {/* Phone numbers for this group */}
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Phone Numbers ({group.phoneNumbers.filter((p) => p.trim()).length})</Typography>
                                <Button
                                  size="small"
                                  startIcon={<AddIcon />}
                                  onClick={() => addPhoneNumberToGroup(groupIndex)}
                                  variant="text"
                                >
                                  Add
                                </Button>
                              </Box>
                              <Stack spacing={1}>
                                {group.phoneNumbers.map((phone, phoneIndex) => (
                                  <Box key={phoneIndex} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Box
                                      sx={{
                                        flex: 1,
                                        '& .PhoneInput': {
                                          border: '1px solid #d3d4d5',
                                          bgcolor: 'white',
                                          borderRadius: '8px',
                                          padding: '8px',
                                          '&:focus-within': {
                                            borderColor: '#1976d2',
                                            borderWidth: '2px'
                                          }
                                        },
                                        '& .PhoneInputInput': {
                                          border: 'none',
                                          bgcolor: '#fff',
                                          color: '#333',
                                          outline: 'none',
                                          fontSize: '14px',
                                          marginLeft: '8px'
                                        }
                                      }}
                                    >
                                      <PhoneInput
                                        placeholder={`Phone number ${phoneIndex + 1}`}
                                        value={phone}
                                        onChange={(value) => updatePhoneNumberInGroup(groupIndex, phoneIndex, value)}
                                        defaultCountry="CM"
                                        international
                                      />
                                    </Box>
                                    {group.phoneNumbers.length > 1 && (
                                      <IconButton
                                        onClick={() => removePhoneNumberFromGroup(groupIndex, phoneIndex)}
                                        color="error"
                                        size="small"
                                      >
                                        <RemoveIcon />
                                      </IconButton>
                                    )}
                                  </Box>
                                ))}
                              </Stack>
                            </Box>

                            {/* Message for this group */}
                            <TextField
                              label="Message for this group"
                              placeholder="Type your message here..."
                              value={group.message}
                              onChange={(e) => updateMessageGroupMessage(groupIndex, e.target.value)}
                              multiline
                              rows={3}
                              fullWidth
                              size="small"
                              inputProps={{ maxLength: 1000 }}
                              helperText={`${group.message.length}/1000 characters`}
                            />
                          </Paper>
                        ))}
                      </Stack>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* CSV File Upload */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Upload CSV File *
                    </Typography>

                    {!csvFile ? (
                      <Box>
                        <input accept=".csv" style={{ display: 'none' }} id="csv-file-input" type="file" onChange={handleFileUpload} />
                        <label htmlFor="csv-file-input">
                          <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} sx={{ mb: 1 }} fullWidth>
                            Choose CSV File
                          </Button>
                        </label>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          CSV should contain columns for phone numbers and message content (e.g., "phone_number", "content"). Each row
                          should have the recipient's phone number and their personalized message.
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DescriptionIcon color="primary" />
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {csvFile.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {(csvFile.size / 1024).toFixed(1)} KB
                                </Typography>
                              </Box>
                            </Box>
                            <IconButton onClick={removeCSVFile} color="error" size="small">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Paper>

                        {csvError && (
                          <Alert severity="error" sx={{ mb: 1 }}>
                            {csvError}
                          </Alert>
                        )}

                        {csvPreview.length > 0 && !csvError && (
                          <Box>
                            {csvHasContentColumn ? (
                              <Alert severity="success" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                  <strong>Perfect!</strong> Your CSV contains both phone numbers and message content. Each recipient will
                                  receive their personalized message from the CSV file.
                                </Typography>
                              </Alert>
                            ) : (
                              <Alert severity="warning" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                  <strong>Missing message content!</strong> Your CSV only contains phone numbers. Please add a 'content' or
                                  'message' column with the message text for each recipient.
                                </Typography>
                              </Alert>
                            )}

                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Preview ({csvPreview.length - 1} rows)
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 200 }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    {csvPreview[0]?.map((header, index) => (
                                      <TableCell key={index} sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                                        {header}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {csvPreview.slice(1).map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                      {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex}>{cell}</TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Showing first 5 rows. Total recipients will be processed from the full file.
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Box>
          )}

          {/* Message Content - Only show when needed */}
          {!(messageMode === 'bulk' && bulkInputMethod === 'csv') &&
            !(messageMode === 'bulk' && bulkInputMethod === 'manual' && bulkMessageMode === 'multiple') && (
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
            )}
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
            // Message content validation: skip if CSV upload or multiple message mode
            (!(messageMode === 'bulk' && bulkInputMethod === 'csv') &&
              !(messageMode === 'bulk' && bulkInputMethod === 'manual' && bulkMessageMode === 'multiple') &&
              !messageContent.trim()) ||
            (messageMode === 'single' && !phoneNumber) ||
            (messageMode === 'bulk' &&
              bulkInputMethod === 'manual' &&
              bulkMessageMode === 'single' &&
              phoneNumbers.filter((p) => p.trim()).length === 0) ||
            (messageMode === 'bulk' &&
              bulkInputMethod === 'manual' &&
              bulkMessageMode === 'multiple' &&
              !messageGroups.some((group) => group.phoneNumbers.filter((p) => p.trim()).length > 0 && group.message.trim())) ||
            (messageMode === 'bulk' && bulkInputMethod === 'csv' && (!csvFile || csvError || !csvHasContentColumn))
          }
        >
          {messageMode === 'single'
            ? 'Send'
            : bulkInputMethod === 'csv'
              ? `Send to CSV Recipients`
              : bulkMessageMode === 'single'
                ? `Send to ${phoneNumbers.filter((p) => p.trim()).length} recipients`
                : `Send to ${messageGroups.reduce((total, group) => total + group.phoneNumbers.filter((p) => p.trim()).length, 0)} recipients (${messageGroups.length} groups)`}
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
        data-tour="send-message"
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
