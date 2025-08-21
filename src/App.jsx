import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import UpdatePassword from "./pages/UpdatePassword";
import ProfileManagement from './pages/ProfileManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-managent" element={<ProfileManagement />} />
      </Routes>
    </Router>
  );
}

export default App;