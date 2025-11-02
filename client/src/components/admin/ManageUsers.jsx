import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

function ManageUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 1. Fetch all users from the 'users' collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Handle the deletion of a user's *Firestore document*
  const handleDeleteUser = async (userToDelete) => {
    if (userToDelete.id === currentUser.uid) {
      alert("You cannot delete your own admin account.");
      return;
    }
    
    if (!globalThis.confirm(`Are you sure you want to delete the user ${userToDelete.username}? 
WARNING: This will ONLY delete their database record (profile, roles). 
Their login will still exist. 
This action is irreversible.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "users", userToDelete.id));
      // We also need to delete them from 'admins' or 'verifiedHospitals'
      if (userToDelete.role === 'hospital') {
        await deleteDoc(doc(db, "verifiedHospitals", userToDelete.id));
      }
      if (userToDelete.role === 'admin') {
        await deleteDoc(doc(db, "admins", userToDelete.id));
      }
      alert("User database record deleted successfully.");
    } catch (err) {
      console.error("Error deleting user document: ", err);
      alert("Failed to delete user record. Check console and security rules.");
    }
  };

  // 3. Client-side search logic
  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Manage All Users</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by username, email, or role..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-6"
      />

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {(() => {
                      if (user.role === 'hospital') {
                        if (user.isVerified) {
                          return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Verified</span>;
                        }
                        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
                      }
                      return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">N/A</span>;
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user)}
                      disabled={user.id === currentUser.uid} // Disable deleting self
                      className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;