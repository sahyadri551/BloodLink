import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import "../styles/ContentStyles.css";

export default function Story() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStory = async () => {
      try {
        const snap = await getDoc(doc(db, "stories", storyId));
        if (snap.exists() && snap.data().status === "approved")
          setStory(snap.data());
        else setError("Story not found or pending approval.");
      } catch {
        setError("Failed to load story.");
      } finally {
        setLoading(false);
      }
    };
    getStory();
  }, [storyId]);

  if (loading) return <p className="text-muted text-center">Loading...</p>;
  if (error) return <p className="text-muted text-center">{error}</p>;
  if (!story) return null;

  const date = story.createdAt?.toDate
    ? story.createdAt.toDate().toLocaleDateString()
    : "N/A";

  return (
    <div className="page-root">
      <div className="page-container">
        <h1 className="page-title">{story.title}</h1>
        <p className="text-muted text-center mb-6">
          Shared by {story.authorName} on {date}
        </p>
        <div className="card-body">{story.story}</div>
        <div className="mt-8 text-center">
          <Link to="/stories" className="btn-link">
            ← Back to Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
