import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from "@mantine/notifications";
import Layout from './Layout';

import Login from './components/Login';
import Register from './components/Register';
import UpdatePassword from './pages/UpdatePassword';
import HomePage from './pages/HomePage/HomePage';
import Dashboard from './pages/Dashboard';
import ProfileManagement from './pages/ProfileManagement';

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications />
      <Router basename="/task-together">
        <Routes>
          {/* Public routes visible before login */}
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="update-password" element={<UpdatePassword />} />

          {/* Layout with sidebar wrapping authenticated pages */}
          <Route element={<Layout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile-management" element={<ProfileManagement />} />
          </Route>

          {/* Catch-all redirect to login for unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
