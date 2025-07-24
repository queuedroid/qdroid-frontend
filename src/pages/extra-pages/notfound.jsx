import React from 'react';
import { Box, Typography, Button, Card, CardContent, Stack, Alert } from '@mui/material';
import { SearchOff as SearchOffIcon, Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';

export default function NotFound() {
  const navigate = useNavigate();

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
            <SearchOffIcon sx={{ fontSize: 72, color: 'primary.main' }} />

            <Typography variant="h1" sx={{ fontSize: '4rem', fontWeight: 700, color: 'primary.main' }}>
              404
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Page Not Found
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              The page you're looking for doesn't exist or has been moved. Please check the URL or navigate back to a safe place.
            </Typography>

            <Alert severity="info" sx={{ width: '100%' }}>
              <Typography variant="body2">
                <strong>What you can do:</strong>
                <br />
                • Check the URL for typos
                <br />
                • Use the navigation menu to find what you're looking for
                <br />• Return to the dashboard to start over
              </Typography>
            </Alert>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
              <Button variant="contained" startIcon={<HomeIcon />} onClick={() => navigate('/dashboard')} fullWidth>
                Go to Dashboard
              </Button>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} fullWidth>
                Go Back
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </MainCard>
    </Box>
  );
}
