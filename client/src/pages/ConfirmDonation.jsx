import React, { useState } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

function ConfirmDonation() {
  const { currentUser } = useAuth(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFoundUser(null);
    setError('');
    setMessage('');

    if (searchTerm.trim() === '') {
      setError('Please enter a username or email to search.');
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", searchTerm.toLowerCase().trim())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No user found with that username.');
      } else {
        setFoundUser(querySnapshot.docs[0].data());
      }
    } catch (err) {
      console.error("Error searching for user: ", err);
      if (err.code === 'failed-precondition') {
        setError("Search requires a new database index. Please open the console (F12) and click the link in the error message to create it.");
      } else {
        setError('Failed to search for user.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDonation = async () => {
    if (!foundUser) return;

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await addDoc(collection(db, "donations"), {
        donorId: foundUser.uid,
        donorName: foundUser.name || foundUser.username, 
        hospitalId: currentUser.uid, 
        hospitalName: currentUser.username, 
        confirmedAt: serverTimestamp(),
      });

      setMessage(`Donation successfully logged for ${foundUser.username}!`);
      setFoundUser(null);
      setSearchTerm('');
    } catch (err) {
      console.error("Error confirming donation: ", err);
      setError('Failed to confirm donation. Check security rules.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Confirm a Donation
      </h1>
      <div className="bg-white shadow-md rounded-xl p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by donor username..."
            className="grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-2 rounded-md transition ${loading ? 'bg-gray-400' : 'hover:bg-blue-700'}`}
          >
            {loading ? '...' : 'Search'}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mt-4">{message}</p>}

        {foundUser && (
          <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">Donor Found:</h3>
            <p><strong>Username:</strong> {foundUser.username}</p>
            <p><strong>Email:</strong> {foundUser.email}</p>
            <p><strong>Name:</strong> {foundUser.name || 'Not set'}</p>
            <button
              onClick={handleConfirmDonation}
              disabled={submitting}
              className={`w-full mt-4 bg-green-600 text-white py-2 rounded-md transition ${submitting ? 'bg-gray-400' : 'hover:bg-green-700'}`}
            >
              {submitting ? 'Confirming...' : `Confirm 1 Donation for ${foundUser.username}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfirmDonation;