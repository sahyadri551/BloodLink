import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  writeBatch,
  serverTimestamp,
  increment 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function DonateMoney() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const donationAmount = Number.parseInt(amount);
    if (donationAmount <= 0) {
      alert("Please enter a valid amount.");
      setLoading(false);
      return;
    }


    try {
      const batch = writeBatch(db);
      const newDonationRef = doc(collection(db, "monetaryDonations"));
      batch.set(newDonationRef, {
        userId: currentUser.uid,
        userName: currentUser.username || currentUser.email,
        amount: donationAmount,
        createdAt: serverTimestamp()
      });
      const userDocRef = doc(db, "users", currentUser.uid);
      batch.update(userDocRef, {
        totalDonated: increment(donationAmount)
      });
      await batch.commit();

      alert(`Thank you for your "donation" of $${donationAmount}! Your stats have been updated.`);
      navigate('/profile'); 
      
    } catch (err) {
      console.error("Error logging donation:", err);
      alert("Failed to log donation. Check security rules.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Support BloodLink
          </h1>
          <p className="text-gray-500 mt-1">
            Your (simulated) donation helps us cover server costs.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
              Donation Amount (INR)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="50"
              step="50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-md transition duration-200 hover:bg-green-700 font-semibold"
          >
            {loading ? 'Processing...' : `Donate ₹${amount}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DonateMoney;