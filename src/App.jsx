// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { MantineProvider } from '@mantine/core';
// import { Notifications, notifications } from "@mantine/notifications";

// import Login from './components/Login';
// import Register from './components/Register';
// import Dashboard from './pages/Dashboard';

// import HomePage from "./pages/HomePage/HomePage";
// import ProfileManagement from './pages/ProfileManagement';

// import UpdatePassword from './pages/UpdatePassword';

// function App() {
//   return (
//     <MantineProvider withGlobalStyles withNormalizeCSS>
//       <Notifications />

//       <Router basename="/task-together">
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/update-password" element={<UpdatePassword />} />
//           <Route path="/dashboard" element={<Dashboard />} /> 
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/profile-managent" element={<ProfileManagement />} />
//         </Routes>
//       </Router>
//     </MantineProvider>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from "@mantine/notifications";

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';

import HomePage from "./pages/HomePage/HomePage";
import ProfileManagement from './pages/ProfileManagement';

import UpdatePassword from './pages/UpdatePassword';

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications />

      <Router basename="/task-together">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile-managent" element={<ProfileManagement />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;