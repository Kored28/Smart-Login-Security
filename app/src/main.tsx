import { createRoot } from 'react-dom/client'
import { createHashRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import './index.css'
import App from './App.tsx'
import Dashboard from './pages/dashboard/dashboard.tsx'
import Activity from './pages/activity/activity.tsx'
import Logs from './pages/logs/logs.tsx'
import Settings from './pages/settings/settings.tsx'

const pageRouteMap: Record<string, string> = {
  'smart-login-security': '/',
  'smart-login-security-activity': '/activity',
  'smart-login-security-logs': '/logs',
  'smart-login-security-settings': '/settings'
};

const params = new URLSearchParams(window.location.search);
const currentPage = params.get('page') ?? '';
const targetRoute = pageRouteMap[currentPage];

// Only redirect if the hash does not match
if(targetRoute && window.location.hash !== `#${targetRoute}`){
  window.location.replace(
    window.location.pathname + window.location.search + `#${targetRoute}`
  );
}

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true,       element: <Dashboard/> },
      { path: 'activity',  element: <Activity /> },
      { path: 'logs',      element: <Logs /> },
      { path: 'settings',  element: <Settings /> },
    ]
  }
])

createRoot(document.getElementById('smart-login-root')!).render(
  <RouterProvider router={router} />
)
