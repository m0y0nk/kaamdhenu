import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import WorkerProfile from './pages/WorkerProfile';
import WorkerDashboard from './pages/WorkerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import BusinessJobs from './pages/BusinessJobs';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/workers/:id" element={<WorkerProfile />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          
          <Route
            path="/dashboard/worker"
            element={
              <ProtectedRoute>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/business/jobs"
            element={
              <ProtectedRoute>
                <BusinessJobs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
