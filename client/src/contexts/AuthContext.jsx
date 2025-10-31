import React, { useContext, useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebase/config'; // <-- 1. Import db
import { doc, getDoc } from "firebase/firestore"; // <-- 2. Import doc and getDoc
import PropTypes from 'prop-types';

// 1. Create the Context
const AuthContext = React.createContext();

// 2. Create a "hook"
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Create the Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is a real-time listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => { // 3. Make this callback async
      if (user) {
        // User is logged in. Now, fetch their Firestore profile.
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // 4. COMBINE auth user and firestore data
            const fullUserData = {
              ...user, // uid, email, emailVerified
              ...docSnap.data() // role, name, bloodType, isVerified, etc.
            };
            setCurrentUser(fullUserData);
          } else {
            // This case might happen if Firestore doc creation failed
            // during registration.
            console.warn("User is authenticated but no profile was found in Firestore.");
            setCurrentUser(user); // Fallback to just the auth user
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setCurrentUser(user); // Fallback to just the auth user
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // 4. Memoize the value object
  const value = useMemo(() => ({
    currentUser
  }), [currentUser]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 5. Prop validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};