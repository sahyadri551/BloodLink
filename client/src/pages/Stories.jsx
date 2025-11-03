import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "stories"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const storiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStories(storiesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching stories: ", error);
      if (error.code === 'failed-precondition') {
        alert("This page requires a new database index. Please open the console (F12) and click the link in the error message to create it.");
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  const createSnippet = (text) => {
    if (!text) return '';
    return text.split(' ').slice(0, 40).join(' ') + '...';
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Donor & Recipient Stories
      </h1>
      <p className="text-center text-lg text-gray-600 mb-8">
        Read real-life stories from members of our community.
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Loading stories...</p>
      ) : stories.length === 0 ? (
        <p className="text-center text-gray-500">No stories have been approved yet. Please check back later.</p>
      ) : (
        <div className="space-y-8">
          {stories.map(story => {
            const formattedDate = story.createdAt?.toDate
              ? story.createdAt.toDate().toLocaleDateString()
              : 'N/A';
            
            return (
              <div key={story.id} className="bg-white shadow-md rounded-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-semibold text-primary-600 mb-2">
                  <Link to={`/story/${story.id}`} className="hover:underline">
                    {story.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Shared by {story.authorName} on {formattedDate}
                </p>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {createSnippet(story.story)}
                </p>
                <Link
                  to={`/story/${story.id}`}
                  className="font-medium text-primary-600 hover:text-primary-800"
                >
                  Read The Full Story &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Stories;