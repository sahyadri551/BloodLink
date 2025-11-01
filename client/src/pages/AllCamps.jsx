import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

function AllCamps() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query the 'bloodCamps' collection, order by date
    const q = query(
      collection(db, "bloodCamps"),
      orderBy("date", "asc") // Show upcoming camps first
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const campsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCamps(campsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching blood camps: ", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Upcoming Blood Donation Camps
      </h1>

        {(() => {
          if (loading) {
            return <p className="text-center text-gray-500">Loading camps...</p>;
          }
          if (camps.length === 0) {
            return (
              <p className="text-center text-gray-500">No upcoming camps have been posted yet. Please check back later.</p>
            );
          }
          return (
            <div className="space-y-6">
              {camps.map(camp => (
                <div key={camp.id} className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                    <h2 className="text-2xl font-semibold text-blue-600">
                      {camp.campName}
                    </h2>
                    <span className="text-lg font-medium text-gray-800">
                      {new Date(camp.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">
                    <strong>Location:</strong> {camp.location}
                  </p>
                  <p className="text-gray-600 mb-3">
                    <strong>Time:</strong> {camp.startTime} - {camp.endTime}
                  </p>
                  {camp.details && (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                      {camp.details}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-4">
                    Organized by: {camp.hospitalName || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          );
        })()}
    </div>
  );
}

export default AllCamps;