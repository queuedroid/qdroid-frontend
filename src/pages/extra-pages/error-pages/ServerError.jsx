import React from 'react';
import { Box, Typography, Button, Alert, Card, CardContent, Stack, Chip } from '@mui/material';
import { CloudOff as CloudOffIcon, Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import MainCard from 'components/MainCard';

const ServerError = ({ error, onRetry }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get error details from state or props
  const errorDetails = location.state?.error || error;

  const getErrorCode = () => {
    if (errorDetails?.response?.status) return errorDetails.response.status;
    if (errorDetails?.message?.includes('500')) return 500;
    if (errorDetails?.message?.includes('502')) return 502;
    if (errorDetails?.message?.includes('503')) return 503;
    return 500;
  };

  const getErrorMessage = () => {
    const code = getErrorCode();
    switch (code) {
      case 500:
        return 'Internal server error. Our servers are experiencing issues.';
      case 502:
        return "Bad gateway. There's an issue connecting to our servers.";
      case 503:
        return 'Service unavailable. Our servers are temporarily down for maintenance.';
      default:
        return "We're experiencing server issues. Please try again later.";
    }
  };

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
            <CloudOffIcon sx={{ fontSize: 72, color: 'error.main' }} />

            <Box>
              <Chip label={`Error ${getErrorCode()}`} color="error" sx={{ mb: 2, fontWeight: 600 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                Server Error
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {getErrorMessage()}
              </Typography>
            </Box>

            <Alert severity="info" sx={{ width: '100%' }}>
              <Typography variant="body2">
                <strong>What can you do?</strong>
                <br />
                • Wait a few minutes and try again
                <br />
                • Check your internet connection
                <br />• Contact support if the problem persists
              </Typography>
            </Alert>

            {import.meta.env.DEV && errorDetails && (
              <Alert severity="warning" sx={{ width: '100%', textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Details:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {errorDetails.message || 'No additional error details available'}
                </Typography>
                {errorDetails.response?.data && (
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mt: 0.5 }}>
                    Response: {JSON.stringify(errorDetails.response.data, null, 2)}
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

export default ServerError;
