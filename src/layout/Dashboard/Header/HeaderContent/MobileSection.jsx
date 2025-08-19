import { useEffect, useRef, useState } from 'react';

// material-ui
import AppBar from '@mui/material/AppBar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// project imports
import Profile from './Profile';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';
import { useOnboardingTour } from '../../../../contexts/OnboardingTourContext';

// assets
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import { InfoCircleOutlined } from '@ant-design/icons';

// ==============================|| HEADER CONTENT - MOBILE ||============================== //

export default function MobileSection() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const { startTour, isCompleted, resetTour } = useOnboardingTour();

  const handleTourClick = () => {
    if (isCompleted) {
      resetTour();
    }
    startTour();
    setOpen(false); // Close the mobile menu
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      // Check if anchorRef.current exists before calling focus
      if (anchorRef.current) {
        anchorRef.current.focus();
      }
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          sx={(theme) => ({
            color: 'text.primary',
            bgcolor: open ? 'grey.300' : 'grey.100',
            ...theme.applyStyles('dark', { bgcolor: open ? 'grey.200' : 'background.default' })
          })}
          aria-label="open more menu"
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="secondary"
          variant="light"
        >
          <MoreOutlined />
        </IconButton>
      </Box>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        sx={{ width: '100%' }}
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1 })}>
              <ClickAwayListener onClickAway={handleClose}>
                <AppBar color="inherit">
                  <Toolbar>
                    {/* Tour Button in Mobile Menu */}
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<InfoCircleOutlined />}
                      onClick={handleTourClick}
                      data-tour="start-tour-mobile"
                      sx={{
                        mr: 2,
                        textTransform: 'none',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          backgroundColor: 'primary.50'
                        }
                      }}
                    >
                      {isCompleted ? 'Tour Again' : 'Take Tour'}
                    </Button>
                    <Profile />
                  </Toolbar>
                </AppBar>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
}
