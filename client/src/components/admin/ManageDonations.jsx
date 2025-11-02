import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

function ManageDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, "donations"),
      orderBy("confirmedAt", "desc") 
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDonations(donationsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching donations: ", error);
      if (error.code === 'failed-precondition') {
        alert("This page requires a new database index. Please open the console (F12) and click the link in the error message to create it.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const filteredDonations = donations.filter(donation =>
    donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">All Confirmed Donations</h2>
      <input
        type="text"
        placeholder="Search by donor or hospital name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.g.target.value)} 
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-6"
      />

      {loading ? ( 
        <p>Loading donation records...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Confirmed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confirmed By (Hospital/Admin)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation) => {
                const formattedDate = donation.confirmedAt?.toDate
                  ? donation.confirmedAt.toDate().toLocaleString()
                  : "N/A";

                return (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donation.donorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.hospitalName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageDonations;