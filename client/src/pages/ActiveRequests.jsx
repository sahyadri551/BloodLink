import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

function ActiveRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "bloodRequests"),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reqs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(reqs);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Active Blood Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No active requests at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {req.name}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Blood Type:</span> {req.bloodType}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Quantity:</span> {req.quantity} units
              </p>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActiveRequests;
