import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

function Post() {
  const { postId } = useParams(); 
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "blogPosts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          setError("Post not found.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]); 

  if (loading) {
    return <p className="text-center text-gray-500 mt-20">Loading post...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-20">{error}</p>;
  }

  if (!post) {
    return <p className="text-center text-gray-500 mt-20">Post not found.</p>;
  }

  const formattedDate = post.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString()
    : 'N/A';

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-md rounded-xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {post.title}
      </h1>
      <p className="text-sm text-gray-500 mb-6 border-b pb-4">
        By <strong>{post.authorName}</strong> on {formattedDate}
      </p>
      
      <div className="prose lg:prose-xl max-w-none text-gray-700 whitespace-pre-wrap">
        {post.content}
      </div>

      <div className="mt-8 border-t pt-4">
        <Link
          to="/blog"
          className="font-medium text-blue-600 hover:text-blue-800"
        >
          &larr; Back to all posts
        </Link>
      </div>
    </div>
  );
}

export default Post;