// assets
import { QuestionOutlined, GithubOutlined, XOutlined, FileSearchOutlined } from '@ant-design/icons';

// icons
const icons = {
  QuestionOutlined,
  GithubOutlined,
  XOutlined,
  FileSearchOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Support',
  type: 'group',
  children: [
    {
      id: 'help',
      title: 'Help',
      type: 'item',
      url: '/dashboard/help',
      icon: icons.QuestionOutlined
    }
  ]
};

export default support;
