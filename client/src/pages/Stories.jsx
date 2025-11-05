import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import "../styles/ContentStyles.css";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "stories"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setStories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading)
    return <p className="text-muted text-center">Loading stories...</p>;

  return (
    <div className="page-root">
      <div className="page-container">
        <h1 className="page-title">Donor & Recipient Stories</h1>
        <p className="page-sub">
          Inspiring real experiences from the BloodLink community.
        </p>

        {stories.length === 0 ? (
          <p className="text-muted text-center">
            No approved stories yet. Check back soon.
          </p>
        ) : (
          stories.map((s) => (
            <div key={s.id} className="card">
              <h2 className="card-title">
                <Link to={`/story/${s.id}`} className="btn-link">
                  {s.title}
                </Link>
              </h2>
              <p className="card-meta">
                Shared by {s.authorName} on{" "}
                {s.createdAt?.toDate
                  ? s.createdAt.toDate().toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="card-body">
                {s.story.split(" ").slice(0, 40).join(" ")}...
              </p>
              <div className="mt-4">
                <Link to={`/story/${s.id}`} className="btn-link">
                  Read Full Story →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
