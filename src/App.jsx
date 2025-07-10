import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import { setupAxiosInterceptors } from 'utils/axiosInterceptors';

import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  // Setup axios interceptors on app initialization
  // This includes automatic 401 error handling - any axios request that returns 401
  // will automatically log the user out and redirect to login page
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
