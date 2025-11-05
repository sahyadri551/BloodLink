import React, { Suspense } from 'react' 
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'


import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import VerifiedHospitalRoute from './components/VerifiedHospitalRoute'
import HospitalOrAdminRoute from './components/HospitalOrAdminRoute'


const Home = React.lazy(() => import('./pages/Home'))
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'))
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'))
const MyAccount = React.lazy(() => import('./pages/MyAccount'))
const FindDonors = React.lazy(() => import('./pages/FindDonors'))
const RequestBlood = React.lazy(() => import('./pages/RequestBlood'))
const ActiveRequests = React.lazy(() => import('./pages/ActiveRequests'))
const MyRequests = React.lazy(() => import('./pages/MyRequests'))
const FindDonation = React.lazy(() => import('./pages/FindDonation'))
const MyBookings = React.lazy(() => import('./pages/MyBookings'))
const HospitalBookings = React.lazy(() => import('./pages/HospitalBookings'))
const AllCamps = React.lazy(() => import('./pages/AllCamps'))
const CreateCamp = React.lazy(() => import('./pages/CreateCamp'))
const EligibilityChecker = React.lazy(() => import('./pages/EligibilityChecker'))
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'))
const WritePost = React.lazy(() => import('./pages/WritePost'))
const Blog = React.lazy(() => import('./pages/Blog'))
const Post = React.lazy(() => import('./pages/Post'))
const DonateMoney = React.lazy(() => import('./pages/DonateMoney'))
const MyDonations = React.lazy(() => import('./pages/MyDonations'))
const Stories = React.lazy(() => import('./pages/Stories'))
const Story = React.lazy(() => import('./pages/Story'))
const SubmitStory = React.lazy(() => import('./pages/SubmitStory'))
const ConfirmDonation = React.lazy(() => import('./pages/ConfirmDonation'))
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="pt-16 grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route 
              path="/admin-dashboard"
              element={<AdminRoute><AdminDashboard /></AdminRoute>} 
            />
            <Route 
              path="/write-post"
              element={<AdminRoute><WritePost /></AdminRoute>} 
            />
            <Route
              path="/create-camp"
              element={<VerifiedHospitalRoute><CreateCamp /></VerifiedHospitalRoute>}
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
              element={<HospitalOrAdminRoute><ConfirmDonation /></HospitalOrAdminRoute>}
            />
            <Route 
              path="/profile" 
              element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
            />
            <Route 
              path="/my-account"
              element={<ProtectedRoute><MyAccount /></ProtectedRoute>} 
            />
            <Route 
              path="/request-blood" 
              element={<ProtectedRoute><RequestBlood /></ProtectedRoute>} 
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
            <Route path="/camps" element={<AllCamps />} />
            <Route path="/find-donors" element={<FindDonors />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App