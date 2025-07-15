import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import RequireAuth from '../components/RequireAuth';
import RequireOnboarding from '../components/RequireOnboarding';
import Landing from '../pages/main/landing';
import NotFound from '../pages/extra-pages/notfound';
import Home from '../pages/main/home';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - other pages
const Exchange = Loadable(lazy(() => import('pages/exchange/index')));
const MessageLogs = Loadable(lazy(() => import('pages/event-logs/index')));
const PaymentLogs = Loadable(lazy(() => import('pages/event-logs/payment-logs')));
const AuthLogs = Loadable(lazy(() => import('pages/event-logs/auth-logs')));
const Subscription = Loadable(lazy(() => import('pages/subscription/index')));
const Settings = Loadable(lazy(() => import('pages/settings/index')));
const Documentation = Loadable(lazy(() => import('pages/extra-pages/documentation')));
const Help = Loadable(lazy(() => import('pages/extra-pages/help')));
const OnboardingStepper = Loadable(lazy(() => import('pages/onboarding/first')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <Landing />
    },
    {
      path: '*',
      element: <NotFound />
    },
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        {
          path: '',
          element: (
            <RequireAuth>
              {/* <RequireOnboarding> */}
              <DashboardDefault />
              {/* </RequireOnboarding> */}
            </RequireAuth>
          )
        },
        { path: 'logs/messages', element: <MessageLogs /> },
        { path: 'logs/payments', element: <PaymentLogs /> },
        { path: 'logs/auth', element: <AuthLogs /> },
        { path: 'exchange', element: <Exchange /> },
        { path: 'subscription', element: <Subscription /> },
        { path: 'settings', element: <Settings /> },
        { path: 'documentation', element: <Documentation /> },
        { path: 'help', element: <Help /> },
        { path: 'onboarding', element: <OnboardingStepper /> }
      ]
    }
  ]
};

export default MainRoutes;
