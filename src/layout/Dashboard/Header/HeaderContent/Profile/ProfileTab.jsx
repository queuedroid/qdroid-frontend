import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// project imports
import { handleLogout as centralizedLogout } from 'utils/api';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab({ onClose }) {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    centralizedLogout();
  };

  // Navigate to settings page
  const handleEditProfile = () => {
    // Close dropdown immediately
    if (onClose) {
      onClose();
    }

    // Navigate
    navigate('/dashboard/settings');
  };

  const handleSettings = () => {
    // Close dropdown immediately
    if (onClose) {
      onClose();
    }

    // Navigate
    navigate('/dashboard/settings');
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton onClick={handleEditProfile}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" />
      </ListItemButton>

      <ListItemButton onClick={handleSettings}>
        <ListItemIcon>
          <SettingOutlined />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>

      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = {
  handleLogout: PropTypes.func,
  onClose: PropTypes.func
};
