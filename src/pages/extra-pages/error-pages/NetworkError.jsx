import React from 'react';
import { Box, Typography, Button, Alert, Card, CardContent, Stack, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { WifiOff as WifiOffIcon, Refresh as RefreshIcon, Home as HomeIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import MainCard from 'components/MainCard';

const NetworkError = ({ onRetry }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get error details from state or props
  const errorDetails = location.state?.error;

  const troubleshootingSteps = [
    'Check your internet connection',
    'Verify that our servers are accessible',
    'Disable any VPN or proxy if enabled',
    'Try refreshing the page',
    'Clear your browser cache and cookies'
  ];

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 100px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <MainCard sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <WifiOffIcon sx={{ fontSize: 72, color: 'warning.main' }} />

            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Connection Problem
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              We're having trouble connecting to our servers. This could be due to a network issue on your end or ours.
            </Typography>

            <Alert severity="warning" sx={{ width: '100%', textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Troubleshooting Steps:
              </Typography>
              <List dense sx={{ pl: 0 }}>
                {troubleshootingSteps.map((step, index) => (
                  <ListItem key={index} sx={{ py: 0.25, pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText primary={step} primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                ))}
              </List>
            </Alert>

            {import.meta.env.DEV && errorDetails && (
              <Alert severity="info" sx={{ width: '100%', textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Details:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {errorDetails.message || 'Network connection failed'}
                </Typography>
                {errorDetails.code && (
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mt: 0.5 }}>
                    Error Code: {errorDetails.code}
                  </Typography>
                )}
              </Alert>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
              <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleRetry} fullWidth>
                Try Again
              </Button>
              <Button variant="outlined" startIcon={<HomeIcon />} onClick={handleGoHome} fullWidth>
                Go Home
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </MainCard>
    </Box>
  );
};

export default NetworkError;
