import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function RequestBlood() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    bloodType: "",
    quantity: "",
    contact: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    for (const [key, value] of Object.entries(formData)) {
      if (!value || value.trim() === "") {
        alert(`Please fill in the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!currentUser) {
      alert("You must be logged in to request blood.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "bloodRequests"), {
        ...formData,
        uid: currentUser.uid,
        createdAt: serverTimestamp(),
        status: "active",
      });

      alert("Blood request submitted successfully!");
      setFormData({
        name: "",
        location: "",
        bloodType: "",
        quantity: "",
        contact: "",
        reason: "",
      });
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white shadow-md rounded-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Request Blood
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Location</label>
          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter city or hospital name"
            required
          />
        </div>
        <div>
          <label htmlFor="BloodType" className="block text-gray-700 font-medium mb-2">Blood Type</label>
          <select
            id="BloodType"
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
          >
            <option value="">Select blood type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">Quantity (in units)</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="e.g., 2"
            required
          />
        </div>
        <div>
          <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">Contact Number</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div>
          <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">Reason / Notes</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Optional: details about the need (e.g., surgery, emergency)"
            rows="3"
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            } text-white font-semibold px-6 py-2 rounded-md transition`}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequestBlood;
