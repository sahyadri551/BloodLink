import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute'
import RequestBlood from './pages/RequestBlood';
import ActiveRequests from './pages/ActiveRequests';
import ForgotPassword from './pages/ForgetPassword';
import MyRequests from './pages/MyRequests';
import FindDonors from './pages/FindDoners';
import AdminRoute from './components/AdminRoute'; 
import AdminDashboard from './pages/AdminDashboard'; 
import VerifiedHospitalRoute from './components/VerifiedHospitalRoute'; 
import CreateCamp from './pages/CreateCamp';
import AllCamps from './pages/AllCamps';
import EligibilityChecker from './pages/EligibilityChecker';
import HospitalOrAdminRoute from './components/HospitalOrAdminRoute';
import ConfirmDonation from './pages/ConfirmDonation';
import WritePost from './pages/WritePost';
import Blog from './pages/Blog';
import Post from './pages/Post';
import MyAccount from './pages/MyAccount';
import Home from './pages/Home';

function App() {
  return (
    <div>
      <Navbar />
      
      <main className="pt-16">
        <Routes>
          <Route 
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/write-post"
            element={<AdminRoute><WritePost /></AdminRoute>} 
          />
          <Route
            path="/create-camp"
            element={
              <VerifiedHospitalRoute>
                <CreateCamp />
              </VerifiedHospitalRoute>
            }
          />
          <Route
            path="/confirm-donation"
            element={
              <HospitalOrAdminRoute>
                <ConfirmDonation />
              </HospitalOrAdminRoute>
            }
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-account"
            element={<ProtectedRoute><MyAccount /></ProtectedRoute>} 
          />
          <Route 
            path="/request-blood" 
            element={
              <ProtectedRoute>
                <RequestBlood />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-requests" 
            element={<ProtectedRoute><MyRequests /></ProtectedRoute>} 
          />
          <Route path="/active-requests" element={<ActiveRequests />} />
          <Route path="/camps" element={<AllCamps />} />
          <Route path="/find-donors" element={<FindDonors />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/eligibility-check" element={<EligibilityChecker />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:postId" element={<Post />} />
        </Routes>
      </main>
      
    </div>
  )
}

export default App