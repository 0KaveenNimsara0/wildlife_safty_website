import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification
} from '../Database/firebase';
import { onAuthStateChanged, signOut, updateEmail, updatePassword } from 'firebase/auth';

const API_BASE_URL = 'http://localhost:5000/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  async function googleSignIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
      return result;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserEmail(email) {
    return updateEmail(currentUser, email);
  }

  function updateUserPassword(password) {
    return updatePassword(currentUser, password);
  }

  function sendEmailVerification(user) {
    return firebaseSendEmailVerification(user || currentUser);
  }

  // Upload profile picture to MongoDB
  async function uploadProfilePicture(file) {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch(`${API_BASE_URL}/users/${currentUser.uid}/profile-picture`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }

      const data = await response.json();
      return data.photoURL;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  // Update user profile in MongoDB
  async function updateUserProfile(profileData) {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const response = await fetch(`${API_BASE_URL}/users/${currentUser.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get user profile from MongoDB
  async function getUserProfile(uid) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${uid}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      console.log('Auth state changed:', user);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    googleSignIn,
    resetPassword,
    updateEmail: updateUserEmail,
    updatePassword: updateUserPassword,
    sendEmailVerification,
    uploadProfilePicture,
    updateUserProfile,
    getUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
