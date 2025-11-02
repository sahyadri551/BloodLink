import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  addDoc, // 1. Import addDoc
  serverTimestamp // 2. Import serverTimestamp
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext'; // 3. Import useAuth
import { useNavigate } from 'react-router-dom';

function FindDonation() {
  const { currentUser } = useAuth(); // 4. Get the current user
  const navigate = useNavigate();

  const [camps, setCamps] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loadingCamps, setLoadingCamps] = useState(true);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  // 5. State to manage the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // --- Effects for fetching data (unchanged) ---
  useEffect(() => {
    const q = query(collection(db, "bloodCamps"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const campsData = snapshot.docs.map(doc => ({ id: doc.id, type: 'camp', ...doc.data() }));
      setCamps(campsData);
      setLoadingCamps(false);
    }, (error) => {
      console.error("Error fetching camps: ", error);
      setLoadingCamps(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "hospital"), where("isVerified", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hospitalData = snapshot.docs.map(doc => ({ id: doc.id, type: 'hospital', ...doc.data() }));
      setHospitals(hospitalData);
      setLoadingHospitals(false);
    }, (error) => {
      console.error("Error fetching hospitals: ", error);
      if (error.code === 'failed-precondition') {
        alert("This page requires a new database index. Please open the console (F12) and click the link in the error message to create it.");
      }
      setLoadingHospitals(false);
    });
    return () => unsubscribe();
  }, []);

  // 6. Functions to open the modal
  const handleOpenModal = (opportunity) => {
    if (!currentUser) {
      alert("Please log in to request an appointment.");
      navigate('/login');
      return;
    }
    setSelectedOpportunity(opportunity);
    setIsModalOpen(true);
  };

  // 7. Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOpportunity(null);
  };

  const allOpportunities = [...camps, ...hospitals];
  const isLoading = loadingCamps || loadingHospitals;

  return (
    <>
      <div className="max-w-4xl mx-auto mt-12 p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Find a Donation Opportunity
        </h1>

        {(() => {
          if (isLoading) {
            return <p className="text-center text-gray-500">Loading opportunities...</p>;
          }
          if (allOpportunities.length === 0) {
            return <p className="text-center text-gray-500">No donation opportunities are available right now.</p>;
          }
          return (
            <div className="space-y-6">
              {allOpportunities.map(opp => (
                opp.type === 'camp'
                  ? <CampCard key={opp.id} camp={opp} onBook={handleOpenModal} />
                  : <HospitalCard key={opp.id} hospital={opp} onBook={handleOpenModal} />
              ))}
            </div>
          );
        })()}
      </div>

      {/* 8. Render the modal */}
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        opportunity={selectedOpportunity}
        user={currentUser}
        navigate={navigate}
      />
    </>
  );
}

// --- Sub-Component for Camp Cards ---
function CampCard({ camp, onBook }) { // 9. Accept onBook prop
  const formattedDate = new Date(camp.date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  
  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
      <button 
        className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        onClick={() => onBook(camp)}
      >
        Request Appointment
      </button>
    </div>
  );
}

// --- Sub-Component for Hospital Cards ---
function HospitalCard({ hospital, onBook }) { 
  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
      <button 
        className="w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        onClick={() => onBook(hospital)} 
      >
        Request Appointment
      </button>
    </div>
  );
}


// --- 13. NEW BOOKING MODAL COMPONENT ---
function BookingModal({ isOpen, onClose, opportunity, user, navigate }) {
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opportunity) {
      setRequestedDate(opportunity.type === 'camp' ? opportunity.date : '');
      setRequestedTime(opportunity.type === 'camp' ? opportunity.startTime : '');
    }
  }, [opportunity]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        userName: user.name || user.username,
        userEmail: user.email,
        
        opportunityId: opportunity.id,
        opportunityName: opportunity.campName || opportunity.name,
        opportunityType: opportunity.type,
        
        requestedDate: requestedDate,
        requestedTime: requestedTime,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("Appointment request sent successfully! You can track its status in 'My Bookings'.");
      onClose(); 
      navigate('/my-bookings'); 
    } catch (err) {
      console.error("Error creating booking: ", err);
      alert("Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6"
        onClick={e => e.stopPropagation()} 
      >
        <h2 className="text-2xl font-bold mb-4">Request Appointment</h2>
        <p className="text-gray-700 mb-2">
          You are requesting an appointment with:
        </p>
        <p className="text-lg font-semibold text-blue-600 mb-6">
          {opportunity.campName || opportunity.name}
        </p>

        <form onSubmit={handleSubmit}>
          {opportunity.type === 'hospital' ? (
            <div className="space-y-4">
              <p>Please suggest a preferred date and time.</p>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Preferred Date</label>
                <input 
                  type="date" 
                  id="date"
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required 
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Preferred Time</label>
                <input 
                  type="time" 
                  id="time"
                  value={requestedTime}
                  onChange={(e) => setRequestedTime(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <p>Please confirm the details for this event:</p>
              <p><strong>Date:</strong> {formattedDate}</p>
              <p><strong>Time:</strong> {opportunity.startTime}</p>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`bg-green-600 text-white px-6 py-2 rounded-md transition ${loading ? 'bg-gray-400' : 'hover:bg-green-700'}`}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FindDonation;