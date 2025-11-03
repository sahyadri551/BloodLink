import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function DonorProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    bloodType: '',
    email: '',
    phone: '',
    location: '',
    emergencyContact: '',
    lastDonationDate: '',
    availability: 'available',
    bio: '',
    profilePicture: null,
    profilePictureURL: '',
    badges: [],
    donationCount: 0,
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        gender: currentUser.gender || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        bloodType: currentUser.bloodType || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        location: currentUser.location || '',
        emergencyContact: currentUser.emergencyContact || '',
        lastDonationDate: currentUser.lastDonationDate || '',
        availability: currentUser.availability || 'available',
        bio: currentUser.bio || '',
        profilePictureURL: currentUser.profilePictureURL || null,
        badges: currentUser.badges || [],
        donationCount: currentUser.donationCount || 0,
        profilePicture: null,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileData((prev) => ({ ...prev, profilePicture: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    try {
      let photoURL = null;
      if (profileData.profilePicture && (profileData.profilePicture instanceof File)) {
        const imageRef = ref(storage, `profilePictures/${currentUser.uid}/${profileData.profilePicture.name}`);
        await uploadBytes(imageRef, profileData.profilePicture);
        photoURL = await getDownloadURL(imageRef);
      }

      const { profilePicture, ...restOfData } = profileData;
      // Ensure location is saved as lowercase for searching
      const dataToSave = {
        ...restOfData,
        location: profileData.location.toLowerCase().trim(), // Standardize location
        profilePictureURL: photoURL || profileData.profilePictureURL || null,
        uid: currentUser.uid,
        email: profileData.email,
        role: currentUser.role,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', currentUser.uid), dataToSave, { merge: true });
      alert('✅ Profile saved successfully!');
      navigate('/');
    } catch (error) {
      console.error(' Error saving profile:', error);
      alert('Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white shadow-md rounded-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        My Donor Profile
      </h1>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">My Stats</h2>

        <div className="flex flex-wrap gap-4 mb-4">
          <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
            🩸 {profileData.donationCount || 0} Blood Donations
          </span>
          <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
            💰 ₹{profileData.totalDonated || 0} Donated
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-3 mt-4 border-t pt-4">My Badges</h3>
        {profileData.badges && profileData.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profileData.badges.map((badge) => (
              <span key={badge} className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                {badge === "First Time Hero" ? "🏆 " : ""}
                {badge === "Bronze Donor" ? "🥉 " : ""}
                {badge === "Silver Donor" ? "🥈 " : ""}
                {badge}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">You have no badges yet. Confirm a donation to get started!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <label htmlFor="profilePicture" className="text-gray-700 font-medium mb-2">
            Profile Picture
          </label>
          <input
            id="profilePicture"
            name="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700 cursor-pointer"
          />
          {
            (profileData.profilePicture instanceof File) ? (
                <img
                src={URL.createObjectURL(profileData.profilePicture)}
                alt="Preview"
                className="mt-4 w-24 h-24 rounded-full object-cover border"
                />
            ) :
            (profileData.profilePictureURL) && (
                <img
                src={profileData.profilePictureURL}
                alt="Profile"
                className="mt-4 w-24 h-24 rounded-full object-cover border"
                />
            )
            }
        </div>

        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={profileData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={profileData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-gray-700 font-medium mb-2">
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={profileData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="bloodType" className="block text-gray-700 font-medium mb-2">
            Blood Type
          </label>
          <select
            id="bloodType"
            name="bloodType"
            value={profileData.bloodType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select your blood type</option>
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
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={profileData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
            Location (City / Region)
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={profileData.location}
            onChange={handleChange}
            placeholder="Enter your city, district, or region"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="emergencyContact" className="block text-gray-700 font-medium mb-2">
            Emergency Contact
          </label>
          <input
            id="emergencyContact"
            name="emergencyContact"
            type="text"
            value={profileData.emergencyContact}
            onChange={handleChange}
            placeholder="Enter emergency contact name & number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="lastDonationDate" className="block text-gray-700 font-medium mb-2">
            Last Donation Date
          </label>
          <input
            id="lastDonationDate"
            name="lastDonationDate"
            type="date"
            value={profileData.lastDonationDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="availability" className="block text-gray-700 font-medium mb-2">
            Availability Status
          </label>
          <select
            id="availability"
            name="availability"
            value={profileData.availability}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <div>
          <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
            Bio / Description
          </label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            value={profileData.bio}
            onChange={handleChange}
            placeholder="Write a short description about yourself or your donor experience"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          ></textarea>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-6 py-2 rounded-md transition duration-200`}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DonorProfile;