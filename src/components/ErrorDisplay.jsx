import React from 'react';
import { Alert, Box, Button, Typography, Card, CardContent, Stack, Divider, Chip } from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Block as BlockIcon
} from '@mui/icons-material';

const ErrorDisplay = ({ error, onRetry, onDismiss, compact = false }) => {
  if (!error) return null;

  const getErrorIcon = (type) => {
    switch (type) {
      case 'server':
        return <ErrorIcon sx={{ fontSize: compact ? 20 : 24 }} />;
      case 'network':
        return <WarningIcon sx={{ fontSize: compact ? 20 : 24 }} />;
      case 'forbidden':
        return <BlockIcon sx={{ fontSize: compact ? 20 : 24 }} />;
      case 'not_found':
        return <InfoIcon sx={{ fontSize: compact ? 20 : 24 }} />;
      default:
        return <ErrorIcon sx={{ fontSize: compact ? 20 : 24 }} />;
    }
  };

  const getErrorSeverity = (type) => {
    switch (type) {
      case 'server':
        return 'error';
      case 'network':
        return 'warning';
      case 'forbidden':
        return 'error';
      case 'not_found':
        return 'info';
      default:
        return 'error';
    }
  };

  const getErrorTitle = (type) => {
    switch (type) {
      case 'server':
        return 'Server Error';
      case 'network':
        return 'Connection Problem';
      case 'forbidden':
        return 'Access Denied';
      case 'not_found':
        return 'Not Found';
      case 'unauthorized':
        return 'Authentication Required';
      default:
        return 'Error';
    }
  };

  const getErrorDescription = (type) => {
    switch (type) {
      case 'server':
        return 'Our servers are experiencing issues. This has been logged and will be investigated.';
      case 'network':
        return 'Unable to connect to our servers. Please check your internet connection.';
      case 'forbidden':
        return 'You do not have permission to perform this action.';
      case 'not_found':
        return 'The requested resource could not be found.';
      case 'unauthorized':
        return 'Your session has expired. Please log in again.';
      default:
        return 'An unexpected error occurred.';
    }
  };

  if (compact) {
    return (
      <Alert
        severity={getErrorSeverity(error.type)}
        sx={{ mb: 2 }}
        action={
          onRetry && (
            <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={onRetry}>
              Retry
            </Button>
          )
        }
        onClose={onDismiss}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {getErrorTitle(error.type)}
        </Typography>
        <Typography variant="body2">{error.message || getErrorDescription(error.type)}</Typography>
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3, border: `1px solid`, borderColor: `${getErrorSeverity(error.type)}.main` }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getErrorIcon(error.type)}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {getErrorTitle(error.type)}
            </Typography>
            <Chip label={error.type.toUpperCase()} color={getErrorSeverity(error.type)} size="small" />
          </Box>

          <Typography variant="body1" color="text.secondary">
            {error.message || getErrorDescription(error.type)}
          </Typography>

          {import.meta.env.DEV && error.originalError && (
            <>
              <Divider />
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Development Details:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {error.originalError.message || 'No additional details available'}
                </Typography>
                {error.originalError.response?.status && (
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mt: 0.5 }}>
                    Status: {error.originalError.response.status}
                  </Typography>
                )}
              </Alert>
            </>
          )}

          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            {onRetry && (
              <Button variant="contained" startIcon={<RefreshIcon />} onClick={onRetry} size="small">
                Try Again
              </Button>
            )}
            {onDismiss && (
              <Button variant="outlined" onClick={onDismiss} size="small">
                Dismiss
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
