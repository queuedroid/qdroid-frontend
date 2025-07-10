import { useState, useEffect } from 'react';
// material-ui
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Stack,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'components/MainCard';
import { useUserDetails } from 'hooks/useUserDetails';
import { handleLogout as centralizedLogout } from 'utils/api';

// assets
import avatar1 from 'assets/images/users/user-1.jpg';
import avatar2 from 'assets/images/users/user-2.jpg';
import avatar3 from 'assets/images/users/user-3.jpg';
import avatar4 from 'assets/images/users/user-4.jpg';
import avatar5 from 'assets/images/users/user-5.jpg';
import { EditOutlined, SaveOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';

const avatarOptions = [
  { id: 'user-1', src: avatar1, name: 'Avatar 1' },
  { id: 'user-2', src: avatar2, name: 'Avatar 2' },
  { id: 'user-3', src: avatar3, name: 'Avatar 3' },
  { id: 'user-4', src: avatar4, name: 'Avatar 4' },
  { id: 'user-6', src: avatar5, name: 'Avatar 5' }
];

export default function Settings() {
  const theme = useTheme();
  const { userDetails, fetchUserDetails } = useUserDetails();

  // State management
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('avatar-1');
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);

  // Load user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // Update form fields when userDetails changes
  useEffect(() => {
    if (userDetails) {
      setProfileName(userDetails.name || '');
      setProfileEmail(userDetails.email || '');
      setProfilePhone(userDetails.phone_number || '');

      // Get saved avatar from localStorage or default to avatar-1
      const savedAvatar = localStorage.getItem('userAvatar') || 'user-5';
      setSelectedAvatar(savedAvatar);
    }
  }, [userDetails]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAvatarChange = () => {
    setOpenAvatarDialog(true);
  };

  const handleAvatarSave = () => {
    localStorage.setItem('userAvatar', selectedAvatar);
    setOpenAvatarDialog(false);
    showSnackbar('Profile picture updated successfully!');
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      // Here you would typically make an API call to update user profile
      // For now, we'll just update localStorage
      if (profileName.trim()) {
        localStorage.setItem('username', profileName.trim());
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSnackbar('Profile updated successfully!');
      fetchUserDetails(); // Refresh user details
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getCurrentAvatarSrc = () => {
    const avatarOption = avatarOptions.find((option) => option.id === selectedAvatar);
    return avatarOption ? avatarOption.src : avatar1;
  };

  const handleLogout = async () => {
    try {
      await centralizedLogout();
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, the centralizedLogout function will handle cleanup
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid size={12}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and profile information
        </Typography>
      </Grid>

      {/* Profile Settings Card */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <MainCard title="Profile Settings">
          <CardContent>
            <Grid container spacing={3}>
              {/* Profile Picture Section */}
              <Grid size={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Profile Picture
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    src={getCurrentAvatarSrc()}
                    sx={{
                      width: 100,
                      height: 100,
                      border: `3px solid ${theme.palette.primary.main}`
                    }}
                  />
                  <Box>
                    <Button variant="outlined" startIcon={<EditOutlined />} onClick={handleAvatarChange} sx={{ mb: 1 }}>
                      Change Picture
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      Choose from available avatar options
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Personal Information */}
              <Grid size={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Personal Information
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Name"
                  disabled
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled // Email usually shouldn't be editable
                  helperText="Contact support to change your email"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="Enter your phone number"
                  disabled // Phone usually shouldn't be editable
                  helperText="Contact support to change your phone"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Account ID"
                  value={userDetails.account_id || 'Loading...'}
                  disabled
                  helperText="Your unique account identifier"
                />
              </Grid>
            </Grid>
          </CardContent>
          {/* <CardActions sx={{ px: 3, pb: 3 }}>
            <Button variant="contained" startIcon={<SaveOutlined />} onClick={handleProfileSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardActions> */}
        </MainCard>
      </Grid>

      {/* Account Information Card */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <MainCard title="Account Information">
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Avatar
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Avatar src={getCurrentAvatarSrc()} sx={{ width: 40, height: 40 }} />
                  <Typography variant="body2">
                    {avatarOptions.find((option) => option.id === selectedAvatar)?.name || 'Default Avatar'}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Profile Status
                </Typography>
                <Chip
                  label={profileName ? 'Complete' : 'Incomplete'}
                  color={profileName ? 'success' : 'warning'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Today
                </Typography>
              </Box>

              {/* Logout Section */}
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button variant="outlined" color="error" startIcon={<LogoutOutlined />} onClick={handleLogout} fullWidth sx={{ mb: 1 }}>
                  Logout
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                  Sign out of your account
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </MainCard>
      </Grid>

      {/* Avatar Selection Dialog */}
      <Dialog open={openAvatarDialog} onClose={() => setOpenAvatarDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UserOutlined />
            Choose Profile Picture
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select an avatar for your profile
          </Typography>
          <RadioGroup value={selectedAvatar} onChange={(e) => setSelectedAvatar(e.target.value)}>
            <Grid container spacing={2}>
              {avatarOptions.map((option) => (
                <Grid size={{ xs: 6, sm: 4 }} key={option.id}>
                  <FormControlLabel
                    value={option.id}
                    control={<Radio />}
                    label=""
                    sx={{
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      border: selectedAvatar === option.id ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                      borderRadius: 2,
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -6 }}>
                    <Avatar
                      src={option.src}
                      sx={{
                        width: 60,
                        height: 60,
                        mb: 1,
                        border: selectedAvatar === option.id ? `2px solid ${theme.palette.primary.main}` : 'none'
                      }}
                    />
                    <Typography variant="caption">{option.name}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAvatarDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAvatarSave}>
            Save Picture
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
