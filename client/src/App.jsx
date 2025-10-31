import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import RequestBlood from './pages/RequestBlood';
import ActiveRequests from './pages/ActiveRequests';
import ForgotPassword from './pages/ForgetPassword';
import MyRequests from './pages/MyRequests';
import FindDonors from './pages/FindDoners';
function App() {
  return (
    <div>
      <Navbar />
      
      <main className="pt-16">
        <Routes>
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/request-blood"  // <-- NEW PROTECTED ROUTE
            element={
              <ProtectedRoute>
                <RequestBlood />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-requests" // <-- 2. Add this new route
            element={<ProtectedRoute><MyRequests /></ProtectedRoute>} 
          />
          <Route path="/active-requests" element={<ActiveRequests />} />
          <Route path="/find-donors" element={<FindDonors />} />
          <Route path="/" element={<h1>Welcome Home! (You are logged in)</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
      
    </div>
  )
}

export default App