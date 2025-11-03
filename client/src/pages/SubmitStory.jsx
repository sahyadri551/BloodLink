import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function SubmitStory() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !story) {
      alert("Please fill in both the title and your story.");
      return;
    }

    setLoading(true);

    try {
      // 1. Add the new document to the 'stories' collection
      await addDoc(collection(db, "stories"), {
        title: title,
        story: story,
        authorName: currentUser.name || currentUser.username,
        authorId: currentUser.uid,
        createdAt: serverTimestamp(),
        status: 'pending', // 2. Default status for admin approval
      });

      alert('✅ Thank you! Your story has been submitted for review.');
      navigate('/'); // Redirect home
    } catch (error) {
      console.error("❌ Error submitting story:", error);
      alert('Failed to submit story. Please check console and security rules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Share Your Story
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Have you been impacted by a donation? Share your experience to inspire others.
      </p>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2 text-lg">
            Story Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., How a Donation Saved My Father"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        {/* Story Content */}
        <div>
          <label htmlFor="story" className="block text-gray-700 font-medium mb-2 text-lg">
            Your Story
          </label>
          <textarea
            id="story"
            name="story"
            rows="10"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Share your experience..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-right pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`bg-primary-600 text-white px-6 py-2 rounded-md transition duration-200 ${
              loading ? 'bg-gray-400' : 'hover:bg-primary-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubmitStory;