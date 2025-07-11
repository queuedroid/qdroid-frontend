import React, { useState, useRef } from 'react';
// material-ui
import { Grid, Typography, Box, Paper, List, ListItem, Alert, Snackbar, Chip, Stack, Card, CardContent } from '@mui/material';
import { Message as MessageIcon, Check as CheckIcon, Error as ErrorIcon, AccessTime as ClockIcon } from '@mui/icons-material';

// project imports
import MainCard from 'components/MainCard';

export default function Message() {
  // State management
  const [messageHistory, setMessageHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const messageInputRef = useRef(null);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid size={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h4">Messages</Typography>
          <Typography variant="body2" color="text.secondary">
            Message history and queue management
          </Typography>
        </Box>
      </Grid>

      {/* Main Chat Interface */}
      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard>
          {/* Message Info */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> Queues are now managed automatically by the system. Use the global compose button to send messages
                from any page.
              </Typography>
            </Alert>
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

          {/* Global Compose Info */}
          <MainCard>
            <Typography variant="h6" gutterBottom>
              Compose Messages
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use the floating compose button (bottom right) to send messages from any page. Queues are managed automatically.
            </Typography>
          </MainCard>
        </Stack>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
