import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

function ManageStories() {
  const [pendingStories, setPendingStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all stories where status is 'pending'
  useEffect(() => {
    const q = query(
      collection(db, "stories"),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPendingStories(stories);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching pending stories: ", error);
      if (error.code === 'failed-precondition') {
        alert("This page requires a new database index. Please open the console (F12) and click the link in the error message to create it.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Approve function (sets status to 'approved')
  const handleApprove = async (id) => {
    const docRef = doc(db, "stories", id);
    try {
      await updateDoc(docRef, { status: 'approved' });
      alert("Story approved and published!");
    } catch (err) {
      console.error("Error approving story: ", err);
      alert("Failed to approve story.");
    }
  };

  // 3. Delete function
  const handleDelete = async (id) => {
    if (!globalThis.confirm("Are you sure you want to delete this story?")) return;
    const docRef = doc(db, "stories", id);
    try {
      await deleteDoc(docRef);
      alert("Story deleted successfully.");
    } catch (err) {
      console.error("Error deleting story: ", err);
      alert("Failed to delete story.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Story Approval Queue</h2>
      {(() => {
        if (loading) {
          return <p>Loading pending stories...</p>;
        }
        if (pendingStories.length === 0) {
          return <p className="text-gray-500">No stories are currently awaiting approval.</p>;
        }
        return (
          <div className="space-y-4">
            {pendingStories.map((story) => (
            <div key={story.id} className="p-4 border rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800">{story.title}</h3>
              <p className="text-sm text-gray-500 mb-2">By: {story.authorName}</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md border">{story.story}</p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleApprove(story.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDelete(story.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

export default ManageStories;