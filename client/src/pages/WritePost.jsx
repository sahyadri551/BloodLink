import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/ContentStyles.css";

export default function WritePost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both the title and content.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "blogPosts"), {
        title,
        content,
        authorName: currentUser?.username || currentUser?.email || "Anonymous",
        authorId: currentUser?.uid || "guest",
        createdAt: serverTimestamp(),
      });

      alert("✅ Blog post published successfully!");
      navigate("/blog");
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("Failed to publish post. Check console or Firebase rules.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-root">
      <div className="page-container">
        <h1 className="page-title">Write a New Blog Post</h1>
        <p className="page-sub">
          Share your experience or insight to inspire the BloodLink community.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title" className="field-label">Post Title</label>
          <input
            className="field-input"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A catchy title for your post"
          />

          <label htmlFor="content" className="field-label" style={{ marginTop: "1.2rem" }}>
            Content
          </label>
          <textarea
            className="field-textarea"
            rows="12"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article here..."
          />

          <div style={{ textAlign: "right", marginTop: "1.8rem" }}>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
