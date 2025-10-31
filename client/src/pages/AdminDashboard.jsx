import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

function AdminDashboard() {
  const [unverifiedHospitals, setUnverifiedHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  // This useEffect listens for unverified hospitals in real-time
  useEffect(() => {
    // Query for users that are 'hospitals' AND 'isVerified' is false
    const q = query(
      collection(db, "users"),
      where("role", "==", "hospital"),
      where("isVerified", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hospitals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUnverifiedHospitals(hospitals);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching unverified hospitals: ", error);
      // This will likely be a "Missing Index" error.
      if (error.code === 'failed-precondition') {
        alert("This page requires a new database index. Please open the console (F12) and click the link in the error message to create it.");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  // This function runs when the admin clicks "Approve"
  const approveHospital = async (id) => {
    const docRef = doc(db, "users", id);
    try {
      await updateDoc(docRef, {
        isVerified: true
      });
      alert("Hospital approved successfully!");
    } catch (err) {
      console.error("Error approving hospital: ", err);
      alert("Failed to approve hospital.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Hospital Approval Queue</h2>
        {(() => {
          if (loading) {
            return <p>Loading...</p>;
          }
          if (unverifiedHospitals.length === 0) {
            return <p className="text-gray-500">No hospitals are currently awaiting approval.</p>;
          }
          return (
          <div className="space-y-4">
            {unverifiedHospitals.map((hospital) => (
              <div key={hospital.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">{hospital.username}</p>
                  <p className="text-sm text-gray-500">{hospital.email}</p>
                </div>
                <button
                  onClick={() => approveHospital(hospital.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        )})()}
      </div>
    </div>
  );
}

export default AdminDashboard;