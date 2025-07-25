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
  Snackbar,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'components/MainCard';
import { useUserDetails } from 'hooks/useUserDetails';
import { handleLogout as centralizedLogout, userAPI } from 'utils/api';

// assets
import avatar1 from 'assets/images/users/user-1.jpg';
import avatar2 from 'assets/images/users/user-2.jpg';
import avatar3 from 'assets/images/users/user-3.jpg';
import avatar4 from 'assets/images/users/user-4.jpg';
import avatar5 from 'assets/images/users/user-5.jpg';
import { EditOutlined, SaveOutlined, UserOutlined, LogoutOutlined, LockOutlined, DeleteOutlined } from '@ant-design/icons';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

  // Change password state management
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Delete account state management
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Load user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // Update form fields when userDetails changes
  useEffect(() => {
    if (userDetails) {
      setProfileName(userDetails.full_name || '');
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

  // Password change functions
  const validatePasswordForm = () => {
    const errors = {};
    let isValid = true;

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(passwordForm.newPassword)) {
      errors.newPassword =
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
      isValid = false;
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = 'New password must be different from current password';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    try {
      setPasswordLoading(true);
      await userAPI.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      });

      showSnackbar('Password changed successfully!', 'success');
      setOpenPasswordDialog(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
    } catch (error) {
      console.error('Error changing password:', error);

      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        showSnackbar('Current password is incorrect', 'error');
      } else if (error.message.includes('400')) {
        showSnackbar('Invalid password format', 'error');
      } else {
        showSnackbar('Failed to change password. Please try again.', 'error');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Delete account functions
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Password is required to delete your account');
      return;
    }

    try {
      setDeleteLoading(true);
      await userAPI.deleteAccount({
        password: deletePassword
      });

      showSnackbar('Account deleted successfully. You will be logged out shortly.', 'success');

      // Give user time to see the message, then logout
      setTimeout(() => {
        centralizedLogout();
      }, 3000);

      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting account:', error);

      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        setDeleteError('Incorrect password');
      } else if (error.message.includes('400')) {
        setDeleteError('Invalid request');
      } else {
        setDeleteError('Failed to delete account. Please try again.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setDeletePassword('');
    setDeleteError('');
    setShowDeletePassword(false);
  };

  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
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

      {/* Profile Information Card */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <MainCard title="Profile Information">
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
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {profileName || 'User'}
                    </Typography>
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
        </MainCard>
      </Grid>

      {/* Security & Account Management Card */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <MainCard title="Security & Account Management">
          <CardContent>
            <Grid container spacing={4}>
              {/* Password Section */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                      Change Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Update your password to keep your account secure
                    </Typography>
                    <Button variant="outlined" startIcon={<LockOutlined />} onClick={() => setOpenPasswordDialog(true)}>
                      Change Password
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* Session Management */}
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                      Logout
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Sign out of your account on this device
                    </Typography>
                    <Button variant="outlined" color="warning" startIcon={<LogoutOutlined />} onClick={handleLogout}>
                      Logout
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* Account Deletion */}
              <Grid size={12}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: 'error.main' }}>
                        Delete Account
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Permanently delete your account. This action cannot be undone.
                      </Typography>
                      <Button variant="outlined" color="error" startIcon={<DeleteOutlined />} onClick={handleDeleteDialogOpen}>
                        Delete Account
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Security Recommendations */}
            </Grid>
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

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={handlePasswordDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockOutlined />
            Change Password
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your current password and choose a new secure password
          </Typography>

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={() => togglePasswordVisibility('current')} edge="end">
                      {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword || 'Minimum 8 characters with uppercase, lowercase, number, and special character'}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={() => togglePasswordVisibility('new')} edge="end">
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={() => togglePasswordVisibility('confirm')} edge="end">
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose} disabled={passwordLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
          >
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteOutlined style={{ color: theme.palette.error.main }} />
            Delete Account
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              <strong>Warning:</strong> This action is irreversible!
            </Typography>
            <Typography variant="body2">Deleting your account will permanently remove all your data including:</Typography>
            <Typography variant="body2" component="div" sx={{ mt: 1, ml: 2 }}>
              • All exchanges and queues
              <br />
              • Message history and logs
              <br />
              • API keys and configurations
              <br />• Profile information
            </Typography>
          </Alert>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please enter your password to confirm account deletion:
          </Typography>

          <TextField
            fullWidth
            label="Password"
            type={showDeletePassword ? 'text' : 'password'}
            value={deletePassword}
            onChange={(e) => {
              setDeletePassword(e.target.value);
              if (deleteError) setDeleteError('');
            }}
            error={!!deleteError}
            helperText={deleteError}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={() => setShowDeletePassword(!showDeletePassword)} edge="end">
                    {showDeletePassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            disabled={deleteLoading || !deletePassword}
            startIcon={deleteLoading ? null : <DeleteOutlined />}
          >
            {deleteLoading ? 'Deleting Account...' : 'Delete My Account'}
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
