// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

// project imports
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import { useOnboardingTour } from '../../../../contexts/OnboardingTourContext';

// project import
import { GithubOutlined } from '@ant-design/icons';
import { InfoCircleOutlined } from '@ant-design/icons';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { startTour, isCompleted, resetTour } = useOnboardingTour();

  const handleTourClick = () => {
    if (isCompleted) {
      resetTour();
    }
    startTour();
  };

  return (
    <>
      <Box sx={{ width: '100%', ml: 1 }} />

      {/* Onboarding Tour Button */}
      <Tooltip title={isCompleted ? 'Restart Getting Started Tour' : 'Take a Quick Tour'}>
        <Button
          variant="contained"
          size="small"
          startIcon={<InfoCircleOutlined />}
          onClick={handleTourClick}
          data-tour="start-tour"
          sx={{
            mr: 1,
            textTransform: 'none',
            whiteSpace: 'nowrap',
            minWidth: 'auto',
            flexShrink: 0
          }}
        >
          {isCompleted ? 'Tour Again' : 'Take Tour'}
        </Button>
      </Tooltip>

      <IconButton
        component={Link}
        href="https://github.com/QueueDroid"
        target="_blank"
        disableRipple
        color="secondary"
        title="GitHub"
        sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
      >
        <GithubOutlined />
      </IconButton>

      {/* <Notification /> */}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
