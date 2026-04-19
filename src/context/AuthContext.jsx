import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification
} from '../config/firebase';
import { onAuthStateChanged, signOut, updateEmail, updatePassword } from 'firebase/auth';

import { BASE_URL } from '../config/constants';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getActiveUser = () => {
    if (currentUser) {
      return {
        uid: currentUser.uid || currentUser._id,
        displayName: currentUser.displayName || currentUser.name || currentUser.email,
        email: currentUser.email,
        role: 'user',
        ...currentUser
      };
    }
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        return {
          uid: parsed._id || parsed.id,
          displayName: parsed.name,
          email: parsed.email,
          role: 'admin',
          ...parsed
        };
      } catch (e) {}
    }
    const medicalData = localStorage.getItem('medicalOfficerData');
    if (medicalData) {
      try {
        const parsed = JSON.parse(medicalData);
        return {
          uid: parsed._id || parsed.id,
          displayName: parsed.name,
          email: parsed.email,
          role: 'medicalOfficer',
          ...parsed
        };
      } catch (e) {}
    }
    return null;
  };

  async function mongoLogin(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/auth/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('userToken', data.token);
      localStorage.setItem('mongoUser', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      console.error("MongoDB Login error:", error);
      throw error;
    }
  }

  async function mongoSignup(email, password, displayName) {
    try {
      const response = await fetch(`${BASE_URL}/auth/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('userToken', data.token);
      localStorage.setItem('mongoUser', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      console.error("MongoDB Signup error:", error);
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('mongoUser');
    setCurrentUser(null);
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

      const response = await fetch(`${BASE_URL}/users/${currentUser.uid}/profile-picture`, {
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
      
      const response = await fetch(`${BASE_URL}/users/${currentUser.uid}`, {
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
      const response = await fetch(`${BASE_URL}/users/${uid}`);

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

  // Admin authentication functions
  async function adminLogin(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Admin login failed');
      }

      // Store admin token and data
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminData', JSON.stringify(data.admin));

      return data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  async function adminRegister(name, email, password) {
    try {
      const response = await fetch(`${BASE_URL}/admin/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Admin registration failed');
      }

      // Store admin token and data
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminData', JSON.stringify(data.admin));

      return data;
    } catch (error) {
      console.error('Admin registration error:', error);
      throw error;
    }
  }

  async function adminLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  }

  async function updateUser(userId, userData) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async function deleteUser(userId) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async function searchUsers(query) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/users/search/${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Medical Officer authentication functions
  async function medicalOfficerLogin(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/medical-officer/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Medical officer login failed');
      }

      // Store medical officer token and data
      localStorage.setItem('medicalOfficerToken', data.token);
      localStorage.setItem('medicalOfficerData', JSON.stringify(data.medicalOfficer));

      return data;
    } catch (error) {
      console.error('Medical officer login error:', error);
      throw error;
    }
  }

  async function medicalOfficerRegister(formData) {
    try {
      const response = await fetch(`${BASE_URL}/medical-officer/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Medical officer registration failed');
      }

      // Store medical officer token and data
      localStorage.setItem('medicalOfficerToken', data.token);
      localStorage.setItem('medicalOfficerData', JSON.stringify(data.medicalOfficer));

      return data;
    } catch (error) {
      console.error('Medical officer registration error:', error);
      throw error;
    }
  }

  async function medicalOfficerLogout() {
    localStorage.removeItem('medicalOfficerToken');
    localStorage.removeItem('medicalOfficerData');
  }

  useEffect(() => {
    // Check if we have a persisted MongoDB session
    const savedUser = localStorage.getItem('mongoUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('userToken', token);
        setCurrentUser(user);
      } else if (!localStorage.getItem('mongoUser')) {
        localStorage.removeItem('userToken');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    activeUser: getActiveUser(),
    login: mongoLogin,
    signup: mongoSignup,
    logout,
    googleSignIn,
    mongoLogin,
    mongoSignup,
    resetPassword,
    updateEmail: updateUserEmail,
    updatePassword: updateUserPassword,
    sendEmailVerification,
    uploadProfilePicture,
    updateUserProfile,
    getUserProfile,
    // Admin functions
    adminLogin,
    adminRegister,
    adminLogout,
    updateUser,
    deleteUser,
    searchUsers,
    // Medical Officer functions
    medicalOfficerLogin,
    medicalOfficerRegister,
    medicalOfficerLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

