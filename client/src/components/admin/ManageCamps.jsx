import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, doc, deleteDoc, orderBy, query } from 'firebase/firestore';

function ManageCamps() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, "bloodCamps"),
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const campsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCamps(campsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching camps: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteCamp = async (campId) => {
    if (!globalThis.confirm("Are you sure you want to permanently delete this camp?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "bloodCamps", campId));
      alert("Camp deleted successfully.");
    } catch (err) {
      console.error("Error deleting camp: ", err);
      alert("Failed to delete camp. Check console and security rules.");
    }
  };

  const filteredCamps = camps.filter(camp =>
    camp.campName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camp.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camp.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Manage Blood Camps</h2>

      <input
        type="text"
        placeholder="Search by camp name, location, or hospital..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-6"
      />

      {loading ? (
        <p>Loading camps...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Camp Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCamps.map((camp) => (
                <tr key={camp.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{camp.campName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{camp.hospitalName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{camp.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{camp.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteCamp(camp.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageCamps;