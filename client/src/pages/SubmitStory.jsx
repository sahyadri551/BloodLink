import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import "../styles/ContentStyles.css";

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
  <div className="page-root">
    <div className="page-container">
      <h1 className="page-title">Share Your Story</h1>
      <p className="page-sub">
        Tell the world how blood donation impacted your life.
      </p>

      <form onSubmit={handleSubmit}>
        <label className="field-label">Story Title</label>
        <input
          className="field-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="How a donation saved my family"
        />

        <label className="field-label mt-4">Your Story</label>
        <textarea
          className="field-textarea"
          rows="10"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Share your experience..."
        />

        <div className="mt-5 text-right">
          <button disabled={loading} className="btn-primary">
            {loading ? "Submitting..." : "Submit for Review"}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

export default SubmitStory;