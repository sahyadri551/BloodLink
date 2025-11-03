import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword, 
  deleteUser 
} from 'firebase/auth';
import { auth } from '../firebase/config'; 
import { useNavigate } from 'react-router-dom';

function MyAccount() {
  const { currentUser } = useAuth(); 
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const reauthenticate = async (password) => {
    if (!auth.currentUser) return; 
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    
    try {
      await reauthenticateWithCredential(auth.currentUser, credential); 
      return true;
    } catch (err) {
      console.error(err);
      setError("Incorrect password. Please try again.");
      return false;
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const isReauthenticated = await reauthenticate(currentPassword);
    if (!isReauthenticated) {
      setLoading(false);
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword); 
      setMessage("Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!globalThis.confirm("ARE YOU SURE? This action is permanent and cannot be undone.")) {
      return;
    }

    setLoading(true);

    const isReauthenticated = await reauthenticate(deletePassword);
    if (!isReauthenticated) {
      setLoading(false);
      return;
    }

    try {
      await deleteUser(auth.currentUser); 
      alert("Account deleted successfully.");
      navigate('/login'); 
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account. Please try again.");
      setLoading(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        My Account
      </h1>
      <form onSubmit={handleChangePassword} className="bg-white shadow-md rounded-xl p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Change Password</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}

        <div>
          <label htmlFor="currentPassword"
            className="block text-gray-700 font-medium mb-2">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword"
            className="block text-gray-700 font-medium mb-2">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword"
            className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-2 rounded-md transition ${loading ? 'bg-gray-400' : 'hover:bg-blue-700'}`}
          >
            {loading ? 'Saving...' : 'Save Password'}
          </button>
        </div>
      </form>

      <form onSubmit={handleDeleteAccount} className="bg-white shadow-md rounded-xl p-8 mt-8 border-t-4 border-red-500 space-y-4">
        <h2 className="text-2xl font-semibold text-red-600">Delete Account</h2>
        <p className="text-gray-600">
          This action is permanent. All of your authentication data will be
          deleted.
        </p>
        <p className="font-bold text-red-600">
          Note: This action will NOT delete your Firestore data (like your
          profile or blood requests) or your uploaded profile picture.
          This data will be orphaned.
        </p>
        
        <div>
          <label htmlFor="deletePassword"
            className="block text-gray-700 font-medium mb-2">
            Type your current password to confirm deletion:
          </label>
          <input
            id="deletePassword"
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className={`bg-red-600 text-white px-6 py-2 rounded-md transition ${loading ? 'bg-gray-400' : 'hover:bg-red-800'}`}
          >
            {loading ? 'Deleting...' : 'Delete My Account'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MyAccount;