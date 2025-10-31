import React, { useState,useEffect } from 'react';
import { db, storage } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom';

function Profile() {
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
  });
  useEffect(() => {
    if (!currentUser) return;
    const fetchProfileData = async () => {
      setLoading(true); 
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          console.log("Profile data loaded:", docSnap.data());
          setProfileData(docSnap.data()); 
        } else {
          console.log("No profile found, setting default email.");
          setProfileData((prev) => ({
            ...prev,
            email: currentUser.email, 
          }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        alert("Failed to load profile data.");
      } finally {
        setLoading(false); 
      }
    };

    fetchProfileData(); 

  }, [currentUser]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileData((prev) => ({
      ...prev,
      profilePicture: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to save your profile.');
      return;
    }

    setLoading(true);

    try {
      let photoURL = null;
      if (profileData.profilePicture && (profileData.profilePicture instanceof File)) {
        console.log("New file detected, uploading...");
        const imageRef = ref(
          storage,
          `profilePictures/${currentUser.uid}/${profileData.profilePicture.name}`
        );
        await uploadBytes(imageRef, profileData.profilePicture);
        photoURL = await getDownloadURL(imageRef);
      }
      const { profilePicture, ...restOfProfileData } = profileData;

      const dataToSave = {
        ...restOfProfileData, 
        profilePictureURL: photoURL || profileData.profilePictureURL || null, // Use the new URL, or keep the existing one
        uid: currentUser.uid,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', currentUser.uid), dataToSave, { merge: true });

      alert('Profile saved successfully!');
      navigate('/');

    } catch (error) {
      console.error(' Error saving profile:', error);
      alert('Failed to save profile. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white shadow-md rounded-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Edit Your Profile
      </h1>

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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={profileData.location}
            onChange={handleChange}
            placeholder="Enter your city, district, or region"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          ></textarea>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`${
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

export default Profile;
