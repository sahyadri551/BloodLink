import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

function HospitalProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    bio: '',
    profilePicture: null,
    profilePictureURL: '',
  });

  // Load existing profile data from context
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || currentUser.username || '',
        phone: currentUser.phone || '',
        location: currentUser.location || '',
        bio: currentUser.bio || '',
        profilePictureURL: currentUser.profilePictureURL || null,
        profilePicture: null,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profilePicture: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);

    try {
      let photoURL = null;
      if (formData.profilePicture && (formData.profilePicture instanceof File)) {
        const imageRef = ref(storage, `profilePictures/${currentUser.uid}/${formData.profilePicture.name}`);
        await uploadBytes(imageRef, formData.profilePicture);
        photoURL = await getDownloadURL(imageRef);
      }

      const { profilePicture, ...restOfData } = formData;
      const dataToSave = {
        ...restOfData,
        profilePictureURL: photoURL || formData.profilePictureURL || null,
        uid: currentUser.uid,
        email: currentUser.email,
        role: 'hospital', // Ensure role is maintained
        isVerified: currentUser.isVerified, // Ensure verification status is maintained
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
    <div className="max-w-2xl mx-auto mt-12 bg-white shadow-md rounded-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Hospital / Blood Bank Profile
      </h1>

      {/* Verification Status Badge */}
      <div className="text-center mb-6">
        {currentUser.isVerified ? (
          <span className="px-4 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
            Verified
          </span>
        ) : (
          <span className="px-4 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-full">
            Pending Approval
          </span>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- THIS IS THE CORRECTED SECTION --- */}
        <div className="flex flex-col items-center">
          <label htmlFor="profilePicture" className="text-gray-700 font-medium mb-2">
            Organization Logo / Profile Picture
          </label>
          <input
            id="profilePicture"
            name="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleFileChange} // <-- This function is now used
            className="block text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700 cursor-pointer"
          />
          {
            (formData.profilePicture instanceof File) ? (
                <img
                src={URL.createObjectURL(formData.profilePicture)}
                alt="Preview"
                className="mt-4 w-24 h-24 rounded-full object-cover border"
                />
            ) :
            (formData.profilePictureURL) && (
                <img
                src={formData.profilePictureURL}
                alt="Profile"
                className="mt-4 w-24 h-24 rounded-full object-cover border"
                />
            )
          }
        </div>
        {/* --- END OF FIX --- */}

        {/* Hospital Name */}
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Hospital / Organization Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter the organization's name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* ... rest of the form ... */}
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
            Official Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter a contact number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
            Address / Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your city or full address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
            About
          </label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write a short description about your organization"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2 rounded-md transition`}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
export default HospitalProfile;