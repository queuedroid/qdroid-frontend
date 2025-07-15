// assets
import { MessageOutlined, DollarOutlined, SafetyCertificateOutlined, FileTextOutlined } from '@ant-design/icons';

// icons
const icons = {
  MessageOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined
};

// ==============================|| MENU ITEMS - LOGS ||============================== //

const logs = {
  id: 'group-logs',
  title: 'Logs',
  type: 'group',
  children: [
    {
      id: 'message-logs',
      title: 'Message Logs',
      type: 'item',
      url: '/dashboard/logs/messages',
      icon: icons.MessageOutlined,
      breadcrumbs: false
    },
    {
      id: 'payment-logs',
      title: 'Payment Logs',
      type: 'item',
      url: '/dashboard/logs/payments',
      icon: icons.DollarOutlined,
      breadcrumbs: false
    },
    {
      id: 'auth-logs',
      title: 'Auth Logs',
      type: 'item',
      url: '/dashboard/logs/auth',
      icon: icons.SafetyCertificateOutlined,
      breadcrumbs: false
    }
  ]
};

export default logs;
