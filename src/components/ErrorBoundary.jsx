import React from 'react';
import { Box, Typography, Button, Alert, Card, CardContent, Stack, Divider } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon, Home as HomeIcon, BugReport as BugReportIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Here you could log to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorPage = ({ error, errorInfo, onRetry }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        p: 3
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <ErrorIcon sx={{ fontSize: 64, color: 'error.main' }} />

            <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.main' }}>
              Oops! Something went wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              We encountered an unexpected error. This has been logged and our team will investigate. Please try refreshing the page or
              returning to the dashboard.
            </Typography>

            <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Error Details:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {error?.message || 'Unknown error occurred'}
              </Typography>
            </Alert>

            <Divider sx={{ width: '100%' }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
              <Button variant="contained" startIcon={<RefreshIcon />} onClick={onRetry || handleReload} fullWidth>
                Try Again
              </Button>
              <Button variant="outlined" startIcon={<HomeIcon />} onClick={handleGoHome} fullWidth>
                Go to Dashboard
              </Button>
            </Stack>

            {import.meta.env.DEV && errorInfo && (
              <Alert severity="info" sx={{ width: '100%', textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  <BugReportIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  Details:
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    maxHeight: 200,
                    bgcolor: 'grey.100',
                    p: 1,
                    borderRadius: 1
                  }}
                >
                  {errorInfo.componentStack}
                </Box>
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ErrorBoundary;
