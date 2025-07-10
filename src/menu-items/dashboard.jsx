// assets
import {
  DashboardOutlined,
  CommentOutlined,
  MessageOutlined,
  CheckSquareOutlined,
  UsergroupAddOutlined,
  RiseOutlined,
  ApiOutlined,
  CreditCardOutlined,
  SettingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  MessageOutlined,
  CheckSquareOutlined,
  UsergroupAddOutlined,
  RiseOutlined,
  ApiOutlined,
  CreditCardOutlined,
  SettingOutlined,
  CommentOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    // {
    //   id: 'platforms',
    //   title: 'Platforms',
    //   type: 'item',
    //   url: '/platforms',
    //   icon: icons.UsergroupAddOutlined,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'analytics',
    //   title: 'Analytics',
    //   type: 'item',
    //   url: '/analytics',
    //   icon: icons.RiseOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'exchange',
      title: 'Exchange',
      type: 'item',
      url: '/dashboard/exchange',
      icon: icons.ApiOutlined,
      breadcrumbs: false
    },
    {
      id: 'messages',
      title: 'Message',
      type: 'item',
      url: '/dashboard/messages',
      icon: icons.CommentOutlined,
      breadcrumbs: false
    },
    // {
    //   id: 'subscription',
    //   title: 'Subscription & Billing',
    //   type: 'item',
    //   url: '/dashboard/subscription',
    //   icon: icons.CreditCardOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/dashboard/settings',
      icon: icons.SettingOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
