import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebase/config';
import { doc, onSnapshot } from "firebase/firestore";
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext'; 

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        
        const unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setCurrentUser({ ...user, ...docSnap.data() });
          } else {
            setCurrentUser(user);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user profile:", error);
          setCurrentUser(user);
          setLoading(false);
        });

        return unsubscribeProfile;

      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const value = useMemo(() => ({
    currentUser
  }), [currentUser]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};