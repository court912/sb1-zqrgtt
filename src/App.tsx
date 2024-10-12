import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Locations from './pages/Locations';
import LocationDetails from './pages/LocationDetails';
import UserManagement from './pages/UserManagement';
import UserDetails from './pages/UserDetails';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/new" element={<LocationDetails />} />
            <Route path="/locations/:city/:state" element={<LocationDetails />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/users/new" element={<UserDetails />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;