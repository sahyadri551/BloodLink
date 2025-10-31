import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

function FindDonors() {
  const [bloodType, setBloodType] = useState("");
  const [location, setLocation] = useState("");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setDonors([]);

    try {
      // 1. Start with the base query on the 'users' collection
      let q = query(collection(db, "users"));

      // 2. Create an array of conditions.
      // ALWAYS filter for available donors. This is the new server-side filter.
      let conditions = [where("availability", "==", "available")];

      // 3. Add bloodType if it's provided
      if (bloodType) {
        conditions.push(where("bloodType", "==", bloodType));
      }

      // 4. Add location if it's provided (and search in lowercase)
      if (location && location.trim() !== "") {
        conditions.push(
          where("location", "==", location.toLowerCase().trim())
        );
      }

      // 5. Build the final query with all conditions
      const finalQuery = query(q, ...conditions);

      // 6. Execute the query
      const querySnapshot = await getDocs(finalQuery);
      const results = querySnapshot.docs.map((doc) => doc.data());
      setDonors(results);

    } catch (error) {
      console.error("❌ Error fetching donors:", error);
      // This is the CRITICAL error you will see. The link must be clicked.
      if (error.code === 'failed-precondition') {
        alert(
          "This search requires a new database index. Please open the console (F12) and click the link in the error message to create it."
        );
      } else {
        alert("Failed to fetch donors. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white shadow-md rounded-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Find Blood Donors
      </h1>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {/* Blood Type Filter */}
        <div>
          <label
            htmlFor="bloodType"
            className="block text-gray-700 font-medium mb-2"
          >
            Blood Type
          </label>
          <select
            id="bloodType"
            name="bloodType"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="">Any</option>
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

        {/* Location Filter */}
        <div>
          <label
            htmlFor="location"
            className="block text-gray-700 font-medium mb-2"
          >
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city or region"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 rounded-md transition duration-200`}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Search Results */}
      {loading ? (
        <p className="text-center text-gray-500">Searching for donors...</p>
      ) : donors.length === 0 && searched ? (
        <p className="text-center text-gray-500">
          No donors found matching your criteria.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => {
            // Proactively fixed SonarQube warning
            const statusColor =
              donor.availability === "available"
                ? "text-green-600"
                : "text-red-600";
            
            // Proactively fixed SonarQube warning
            const formattedDate = donor.updatedAt
              ? new Date(donor.updatedAt).toLocaleDateString()
              : "N/A";

            return (
              <div
                key={donor.uid} // FIX: Use stable UID for key
                className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Blood Type: {donor.bloodType}
                </h2>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Location:</span> {donor.location}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">Availability:</span>{" "}
                  <span className={`${statusColor} font-semibold`}>
                    {donor.availability}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-2 italic">
                  Last updated: {formattedDate} {/* FIX: Use updatedAt */}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FindDonors;