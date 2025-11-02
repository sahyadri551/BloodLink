import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

function MyBookings() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return; 
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userBookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(userBookings);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bookings: ", error);
      if (error.code === 'failed-precondition') {
        alert("This page requires a new database index. Please open the console (F12) and click the link in the error message to create it.");
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [currentUser]);

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
        My Appointments
      </h1>

      {(() => {
        if (loading) {
          return <p className="text-center text-gray-500">Loading your appointments...</p>;
        }
        if (bookings.length === 0) {
          return <p className="text-center text-gray-500">You have not requested any appointments yet.</p>;
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
                    <strong>Type:</strong> {booking.opportunityType}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Requested:</strong> {booking.requestedDate} at {booking.requestedTime}
                  </p>
                  <p className="text-xs text-gray-400 mt-4">
                    Request sent on: {formattedDate}
                  </p>
                </div>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
}

export default MyBookings;