import React from 'react';
import { Box, Typography, Button, Alert, Stack } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';

const GenericErrorFallback = ({ error, onRetry, title = 'Something went wrong', description }) => {
  const navigate = useNavigate();

  const defaultDescription = 'An unexpected error occurred. Please try again or contact support if the problem persists.';

  return (
    <Box
      sx={{
        minHeight: 'calc(50vh)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <MainCard sx={{ maxWidth: 500, width: '100%' }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Stack spacing={3} alignItems="center">
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main' }} />

            <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main' }}>
              {title}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {description || defaultDescription}
            </Typography>

            {error?.message && (
              <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Error Details:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {error.message}
                </Typography>
              </Alert>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', pt: 2 }}>
              {onRetry && (
                <Button variant="contained" startIcon={<RefreshIcon />} onClick={onRetry} fullWidth>
                  Try Again
                </Button>
              )}
              <Button variant="outlined" startIcon={<HomeIcon />} onClick={() => navigate('/dashboard')} fullWidth>
                Go to Dashboard
              </Button>
            </Stack>
          </Stack>
        </Box>
      </MainCard>
    </Box>
  );
};

export default GenericErrorFallback;
