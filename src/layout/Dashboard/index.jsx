import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Snackbar, Alert } from '@mui/material';

// project imports
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { GlobalComposeButton } from 'components/GlobalComposeMessage';
import { OnboardingTourProvider } from '../../contexts/OnboardingTourContext';
import TourPopover from '../../components/TourPopover';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // set media wise responsive drawer
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  const handleMessageSent = (response, messageData) => {
    setSnackbar({
      open: true,
      message: `Message sent successfully`,
      severity: 'success'
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (menuMasterLoading) return <Loader />;

  return (
    <OnboardingTourProvider>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Header />
        <Drawer />

        <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
          <Toolbar sx={{ mt: 'inherit' }} />
          <Box
            sx={{
              ...{ px: { xs: 0, sm: 2 } },
              position: 'relative',
              minHeight: 'calc(100vh - 110px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {pathname !== '/apps/profiles/account/my-account' && <Breadcrumbs />}
            <Outlet />
            <Footer />
          </Box>
        </Box>

        {/* Global Compose Message Button */}
        <GlobalComposeButton onMessageSent={handleMessageSent} />

        {/* Tour Popover */}
        <TourPopover />

        {/* Success Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </OnboardingTourProvider>
  );
}
