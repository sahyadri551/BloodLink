import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function CreateCamp() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    campName: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    details: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to create a camp.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'bloodCamps'), {
        ...formData,
        hospitalId: currentUser.uid, 
        hospitalName: currentUser.username || currentUser.email, 
        createdAt: serverTimestamp(),
      });

      alert('Blood camp posted successfully!');
      navigate('/admin-camps');
    } catch (error) {
      console.error("Error posting camp:", error);
      alert('Failed to post camp. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white shadow-md rounded-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Post a New Blood Camp
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="campName" className="block text-gray-700 font-medium mb-2">
            Camp Name
          </label>
          <input
            id="campName"
            name="campName"
            type="text"
            value={formData.campName}
            onChange={handleChange}
            placeholder="e.g., Annual City Blood Drive"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
            Location / Address
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., 123 Main St, City Park"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-gray-700 font-medium mb-2">
              Start Time
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-gray-700 font-medium mb-2">
              End Time
            </label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="details" className="block text-gray-700 font-medium mb-2">
            Additional Details (Optional)
          </label>
          <textarea
            id="details"
            name="details"
            rows="3"
            value={formData.details}
            onChange={handleChange}
            placeholder="e.g., Free snacks provided, contact person, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          ></textarea>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-6 py-2 rounded-md transition duration-200`}
          >
            {loading ? 'Posting...' : 'Post Blood Camp'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCamp;