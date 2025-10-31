import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function MyRequests() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const q = query(
      collection(db, "bloodRequests"),
      where("uid", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reqs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(reqs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleMarkFulfilled = async (id) => {
    if (!globalThis.confirm("Mark this request as fulfilled?")) return;
    try { 
      await updateDoc(doc(db, "bloodRequests", id), { status: "fulfilled" });
      alert("Request marked as fulfilled!");
    } catch (err) {
      console.error("❌ Error updating request:", err);
      alert("Failed to update request.");
    }
  };

  const handleDelete = async (id) => {
    if (!globalThis.confirm("Are you sure you want to delete this request?")) return;
    try {
      await deleteDoc(doc(db, "bloodRequests", id));
      alert("Request deleted successfully!");
    } catch (err) {
      console.error(" Error deleting request:", err);
      alert("Failed to delete request.");
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        My Blood Requests
      </h1>

      {(() => {
        if (loading) {
          return <p className="text-center text-gray-500">Loading your requests...</p>;
        }
        if (requests.length === 0) {
          return (
            <p className="text-center text-gray-500">
              You haven't made any requests yet.
            </p>
          );
        }
        return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {req.bloodType} — {req.quantity} Units
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Location:</span> {req.location}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Contact:</span> {req.contact}
              </p>
              {req.reason && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Reason:</span> {req.reason}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Posted on:{" "}
                {req.createdAt?.toDate
                  ? req.createdAt.toDate().toLocaleString()
                  : "N/A"}
              </p>
              <p
                className={`mt-2 text-sm font-semibold ${
                  req.status === "fulfilled"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Status: {req.status || "active"}
              </p>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-4">
                {req.status !== "fulfilled" && (
                  <button
                    onClick={() => handleMarkFulfilled(req.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition"
                  >
                    Mark as Fulfilled
                  </button>
                )}
                <button
                  onClick={() => handleDelete(req.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )})()}
    </div>
  );
}

export default MyRequests;
