import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query the 'blogPosts' collection, order by creation date (newest first)
    const q = query(
      collection(db, "blogPosts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching blog posts: ", error);
      // This will crash if you don't have the index
      if (error.code === 'failed-precondition') {
        alert("This page requires a new database index. Please open the console (F12) and click the link in the error message to create it.");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Function to create a short snippet from the content
  const createSnippet = (text) => {
    if (!text) return '';
    return text.split(' ').slice(0, 30).join(' ') + '...';
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        BloodLink Blog & Education
      </h1>

      {(() => {
        if (loading) {
          return <p className="text-center text-gray-500">Loading posts...</p>;
        }
        if (posts.length === 0) {
          return <p className="text-center text-gray-500">No blog posts have been published yet.</p>;
        }
        return (
          <div className="space-y-6">
            {posts.map(post => {
            const formattedDate = post.createdAt?.toDate
              ? post.createdAt.toDate().toLocaleDateString()
              : 'N/A';
            
            return (
              <div key={post.id} className="bg-white shadow-md rounded-xl p-6 border border-gray-100 transition-shadow hover:shadow-lg">
                <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                  <Link to={`/blog/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-xs text-gray-400 mb-3">
                  By {post.authorName} on {formattedDate}
                </p>
                <p className="text-gray-700 mb-4">
                  {createSnippet(post.content)}
                </p>
                <Link
                  to={`/blog/${post.id}`}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  Read More &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      )})()}
    </div>
  );
}

export default Blog;