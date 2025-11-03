import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute'
import RequestBlood from './pages/RequestBlood';
import ActiveRequests from './pages/ActiveRequests';
import ForgotPassword from './pages/ForgotPassword';
import MyRequests from './pages/MyRequests';
import AdminRoute from './components/AdminRoute'; 
import AdminDashboard from './pages/AdminDashboard'; 
import VerifiedHospitalRoute from './components/VerifiedHospitalRoute'; 
import CreateCamp from './pages/CreateCamp';
import EligibilityChecker from './pages/EligibilityChecker';
import HospitalOrAdminRoute from './components/HospitalOrAdminRoute';
import ConfirmDonation from './pages/ConfirmDonation';
import WritePost from './pages/WritePost';
import Blog from './pages/Blog';
import Post from './pages/Post';
import MyAccount from './pages/MyAccount';
import Home from './pages/Home';
import FindDonation from './pages/FindDonation';
import MyBookings from './pages/MyBookings';
import HospitalBookings from './pages/HospitalBookings';
import Footer from './components/Footer';
import DonateMoney from './pages/DonateMoney';
import MyDonations from './pages/MyDonations';
import SubmitStory from './pages/SubmitStory'
import Stories from './pages/Stories'; 
import Story from './pages/Story';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="pt-16 grow">
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
            path="/hospital-bookings"
            element={<VerifiedHospitalRoute><HospitalBookings /></VerifiedHospitalRoute>}
          />
          <Route 
            path="/my-bookings"
            element={<ProtectedRoute><MyBookings /></ProtectedRoute>} 
          />
          <Route 
            path="/my-donations"
            element={<ProtectedRoute><MyDonations /></ProtectedRoute>} 
          />
          <Route 
            path="/submit-story"
            element={<ProtectedRoute><SubmitStory /></ProtectedRoute>} 
          />
          <Route 
            path="/donate"
            element={<ProtectedRoute><DonateMoney /></ProtectedRoute>} 
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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/eligibility-check" element={<EligibilityChecker />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:postId" element={<Post />} />
          <Route path="/find-donation" element={<FindDonation />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/story/:storyId" element={<Story />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App