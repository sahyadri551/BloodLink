import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

function Story() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "stories", storyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().status === 'approved') {
          setStory(docSnap.data());
        } else {
          setError("Story not found or is pending approval.");
        }
      } catch (err) {
        console.error("Error fetching story:", err);
        setError("Failed to load story.");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-20">Loading story...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-20">{error}</p>;
  }

  if (!story) {
    return null; 
  }

  const formattedDate = story.createdAt?.toDate
    ? story.createdAt.toDate().toLocaleDateString()
    : 'N/A';

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-md rounded-xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {story.title}
      </h1>
      <p className="text-sm text-gray-500 mb-6 border-b pb-4">
        Shared by <strong>{story.authorName}</strong> on {formattedDate}
      </p>
      
      <div className="prose lg:prose-xl max-w-none text-gray-700 whitespace-pre-wrap">
        {story.story}
      </div>

      <div className="mt-8 border-t pt-4">
        <Link
          to="/stories"
          className="font-medium text-primary-600 hover:text-primary-800"
        >
          &larr; Back to all stories
        </Link>
      </div>
    </div>
  );
}

export default Story;