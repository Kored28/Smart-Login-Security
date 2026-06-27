import { HashRouter, Route, Routes } from "react-router";
import Dashboard from "./pages/dashboard/dashboard";

const pageRouteMap: Record<string, string> = {
  'smart-login-security': '/',
  'smart-login-security-activity': '/activity',
  'smart-login-security-logs': '/logs',
  'smart-security-settings': '/settings'
};

const params = new URLSearchParams(window.location.search);
const currentPage = params.get('page') ?? '';
const targetRoute = pageRouteMap[currentPage];

// Only redirect if the hash does not match
if(targetRoute && window.location.hash !== `#${targetRoute}`){
  window.location.hash = targetRoute;
}

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
      </Routes>
    </HashRouter>
  )
}

export default App
