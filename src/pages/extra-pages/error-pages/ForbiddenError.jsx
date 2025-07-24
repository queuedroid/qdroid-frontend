import React from 'react';
import { Box, Typography, Button, Alert, Card, CardContent, Stack, Chip } from '@mui/material';
import { Block as BlockIcon, Home as HomeIcon, AccountCircle as AccountIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import MainCard from 'components/MainCard';

const ForbiddenError = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get error details from state
  const errorDetails = location.state?.error;

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoToLogin = () => {
    navigate('/login');
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
            <BlockIcon sx={{ fontSize: 72, color: 'error.main' }} />

            <Box>
              <Chip label="Error 403" color="error" sx={{ mb: 2, fontWeight: 600 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                Access Denied
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                You don't have permission to access this resource. This might be because your session has expired or your account doesn't
                have the necessary privileges.
              </Typography>
            </Box>

            <Alert severity="warning" sx={{ width: '100%' }}>
              <Typography variant="body2">
                <strong>What can you do?</strong>
                <br />
                • Check if you're logged in with the correct account
                <br />
                • Contact your administrator for access
                <br />• Return to the dashboard and try again
              </Typography>
            </Alert>

            {import.meta.env.DEV && errorDetails && (
              <Alert severity="info" sx={{ width: '100%', textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Details:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {errorDetails.message || 'Access forbidden'}
                </Typography>
                {errorDetails.response?.data && (
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mt: 0.5 }}>
                    Response: {JSON.stringify(errorDetails.response.data, null, 2)}
                  </Typography>
                )}
              </Alert>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
              <Button variant="contained" startIcon={<HomeIcon />} onClick={handleGoHome} fullWidth>
                Go to Dashboard
              </Button>
              <Button variant="outlined" startIcon={<AccountIcon />} onClick={handleGoToLogin} fullWidth>
                Login Again
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </MainCard>
    </Box>
  );
};

export default ForbiddenError;
