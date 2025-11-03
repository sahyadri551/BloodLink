import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

function HospitalBookings() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Query for bookings where the hospital/camp ID matches the current user's ID
    const q = query(
      collection(db, "bookings"),
      where("opportunityId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hospitalBookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(hospitalBookings);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching hospital bookings: ", error);
      if (error.code === 'failed-precondition') {
        alert("This page requires a new database index. Please open the console (F12) and click the link in the error message to create it.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Function to update the status of a booking
  const updateBookingStatus = async (bookingId, newStatus) => {
    const docRef = doc(db, "bookings", bookingId);
    try {
      await updateDoc(docRef, {
        status: newStatus
      });
      alert(`Booking status updated to ${newStatus}.`);
    } catch (err) {
      console.error("Error updating booking status: ", err);
      alert("Failed to update status.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Manage Appointment Requests
      </h1>

      {(() => {
        if (loading) {
          return <p className="text-center text-gray-500">Loading appointment requests...</p>;
        }
        if (bookings.length === 0) {
          return <p className="text-center text-gray-500">You have not received any appointment requests yet.</p>;
        }
        return (
          <div className="space-y-6">
            {bookings.map(booking => {
            const formattedDate = booking.createdAt?.toDate
              ? booking.createdAt.toDate().toLocaleDateString()
              : 'N/A';
            
            return (
              <div key={booking.id} className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                  <h2 className="text-xl font-semibold text-blue-600">
                    {booking.opportunityName}
                  </h2>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                    Status: {booking.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-1">
                  <strong>Requester:</strong> {booking.userName} ({booking.userEmail})
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Requested:</strong> {booking.requestedDate} at {booking.requestedTime}
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  Request sent on: {formattedDate}
                </p>

                {booking.status === 'pending' && (
                  <div className="flex gap-4 mt-4 border-t pt-4">
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'denied')}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                    >
                      Deny
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )})()}
    </div>
  );
}

export default HospitalBookings;