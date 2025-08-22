import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import UpdatePassword from "./pages/UpdatePassword";
import HomePage from "./pages/HomePage/HomePage";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/dashboard" element={<HomePage />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;