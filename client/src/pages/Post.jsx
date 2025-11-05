import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import "../styles/ContentStyles.css";

export default function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "blogPosts", postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setPost(docSnap.data());
        else setError("Post not found.");
      } catch {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) return <p className="text-muted text-center">Loading post...</p>;
  if (error) return <p className="text-muted text-center">{error}</p>;
  if (!post) return null;

  const formattedDate = post.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString()
    : "N/A";

  return (
    <div className="page-root">
      <div className="page-container">
        <h1 className="page-title">{post.title}</h1>
        <p className="text-muted text-center mb-6">
          By <strong>{post.authorName}</strong> on {formattedDate}
        </p>
        <div className="card-body">{post.content}</div>

        <div className="mt-6 text-center">
          <Link to="/blog" className="btn-link">
            ← Back to All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
