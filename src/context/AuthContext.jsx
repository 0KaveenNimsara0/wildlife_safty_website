import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

import { BASE_URL, IMAGE_BASE_URL } from '../config/constants';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState(() => {
    // Eagerly read from localStorage on first render so profile photos
    // are available immediately for medical officers and admins
    const applyPhotoURL = (parsed) => {
      if (parsed?.photoURL && parsed.photoURL.startsWith('/uploads')) {
        parsed.photoURL = `${IMAGE_BASE_URL}${parsed.photoURL}`;
      }
      return parsed;
    };
    try {
      const adminData = localStorage.getItem('adminData');
      if (adminData) {
        const parsed = JSON.parse(adminData);
        parsed.uid = parsed._id || parsed.id || parsed.uid;
        parsed.role = 'admin';
        return applyPhotoURL(parsed);
      }
      const medicalData = localStorage.getItem('medicalOfficerData');
      if (medicalData) {
        const parsed = JSON.parse(medicalData);
        parsed.uid = parsed._id || parsed.id || parsed.uid;
        parsed.displayName = parsed.name || parsed.displayName;
        parsed.role = 'medicalOfficer';
        return applyPhotoURL(parsed);
      }
      const mongoUser = localStorage.getItem('mongoUser');
      if (mongoUser) {
        const parsed = JSON.parse(mongoUser);
        parsed.uid = parsed._id || parsed.id || parsed.uid;
        return applyPhotoURL(parsed);
      }
    } catch (e) {}
    return null;
  });

  const getActiveUser = useCallback(() => {
    // Helper to process photo URL
    const applyPhotoURL = (user) => {
      if (user?.photoURL && user.photoURL.startsWith('/uploads')) {
        return { ...user, photoURL: `${IMAGE_BASE_URL}${user.photoURL}` };
      }
      return user;
    };

    // 1. Check for Admin persistence
    const adminData = localStorage.getItem("adminData");
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        const user = {
          ...parsed,
          uid: parsed._id || parsed.id || parsed.uid,
          displayName: parsed.name || parsed.displayName,
          email: parsed.email,
          role: "admin",
          source: "mongodb"
        };
        return applyPhotoURL(user);
      } catch (e) {}
    }

    // 2. Check for Medical Officer persistence
    const medicalData = localStorage.getItem("medicalOfficerData");
    if (medicalData) {
      try {
        const parsed = JSON.parse(medicalData);
        const user = {
          ...parsed,
          uid: parsed._id || parsed.id || parsed.uid,
          displayName: parsed.name || parsed.displayName,
          email: parsed.email,
          role: "medicalOfficer",
          source: "mongodb"
        };
        return applyPhotoURL(user);
      } catch (e) {}
    }

    // 3. Fallback to standard User session
    if (currentUser) {
      const isMongoUser = localStorage.getItem("mongoUser");
      const user = {
        ...currentUser,
        uid: currentUser.uid || currentUser._id,
        displayName: currentUser.displayName || currentUser.name || currentUser.email,
        email: currentUser.email,
        emailVerified: currentUser.emailVerified ?? false,
        role: currentUser.role || "user",
        source: isMongoUser ? "mongodb" : "firebase",
        hasPassword: currentUser.hasPassword ?? false
      };
      return applyPhotoURL(user);
    }

    return null;
  }, [currentUser]);

  const syncActiveUser = useCallback(() => {
    setActiveUser(getActiveUser());
  }, [getActiveUser]);

  async function sendRegistrationOtp(email) {
    try {
      const response = await fetch(`${BASE_URL}/shared-auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      return data;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  async function mongoLogin(email, password, otp) {
    try {
      const bodyData = otp ? { email, password, otp } : { email, password };
      const response = await fetch(`${BASE_URL}/auth/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      if (data.requiresOtp) {
        return data;
      }

      localStorage.setItem('userToken', data.token);
      localStorage.setItem('mongoUser', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      console.error("MongoDB Login error:", error);
      throw error;
    }
  }

  async function mongoSignup(email, password, displayName, otp) {
    try {
      const response = await fetch(`${BASE_URL}/auth/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName, otp })
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
      const user = result.user;
      
      // Sync with MongoDB backend
      const response = await fetch(`${BASE_URL}/auth/user/social-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('mongoUser', JSON.stringify(data.user));
        setCurrentUser(data.user);
      } else {
        setCurrentUser(user);
      }
      
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

  async function updateUserPassword(newPassword, currentPassword, otp) {
    if (!currentUser) throw new Error('No user logged in');
    
    // Determine if we need to use MongoDB or Firebase
    const isMongoUser = localStorage.getItem("mongoUser");
    
    if (isMongoUser) {
      const response = await fetch(`${BASE_URL}/auth/user/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          uid: currentUser.uid || currentUser._id,
          currentPassword,
          newPassword,
          otp
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update password');
      return data;
    } else {
      // Fallback for strict Firebase users
      return updatePassword(currentUser, newPassword);
    }
  }

  function sendEmailVerification(user) {
    const targetUser = user || currentUser;
    // Check if it's a Firebase user (Firebase users have getIdToken method)
    if (targetUser && typeof targetUser.getIdToken === "function") {
      return firebaseSendEmailVerification(targetUser);
    }
    // MongoDB User fallback
    return mongoSendEmailVerification(targetUser?.email);
  }

  async function mongoSendEmailVerification(email) {
    const response = await fetch(`${BASE_URL}/shared-auth/verify-email/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to send verification code");
    return data;
  }

  async function verifyEmail(email, otp, role = "user") {
    const response = await fetch(`${BASE_URL}/shared-auth/verify-email/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, role })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Verification failed");

    // Update local state if verified
    if (data.success && data.user) {
      if (role === "admin") {
        localStorage.setItem("adminData", JSON.stringify(data.user));
      } else if (role === "medicalOfficer") {
        localStorage.setItem("medicalOfficerData", JSON.stringify(data.user));
      } else {
        localStorage.setItem("mongoUser", JSON.stringify(data.user));
        setCurrentUser(data.user);
      }
      
      // Post-verification protocol: Force hard sync from backend to update flags
      await refreshUser();
    }
    return data;
  }

  const refreshUser = useCallback(async () => {
    try {
      const active = getActiveUser();
      if (!active || !active.uid) return;

      let endpoint = `/users/${active.uid}`;
      let headers = {};

      if (active.role === 'admin') {
        endpoint = `/admin/users/${active.uid}`;
        const token = localStorage.getItem('adminToken');
        if (token) headers['Authorization'] = `Bearer ${token}`;
      } else if (active.role === 'medicalOfficer') {
        endpoint = `/medical-officer/auth/profile`;
        const token = localStorage.getItem('medicalOfficerToken');
        if (token) headers['Authorization'] = `Bearer ${token}`;
      } else {
        const token = localStorage.getItem('userToken');
        if (token) headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
      if (!response.ok) throw new Error('Identity synchronization failed');
      
      const data = await response.json();
      // Extract the actual user data based on the response shape of each endpoint
      let updatedData;
      if (active.role === 'medicalOfficer') {
        updatedData = data.medicalOfficer || data.user || data;
      } else if (active.role === 'admin') {
        updatedData = data.admin || data.user || data;
      } else {
        updatedData = data.user || data;
      }

      if (active.role === "admin") {
        localStorage.setItem("adminData", JSON.stringify(updatedData));
      } else if (active.role === "medicalOfficer") {
        localStorage.setItem("medicalOfficerData", JSON.stringify(updatedData));
      } else {
        localStorage.setItem("mongoUser", JSON.stringify(updatedData));
        setCurrentUser(updatedData);
      }

      // Trigger activeUser sync
      syncActiveUser();
      
      return updatedData;
    } catch (error) {
      console.error('Deep-sync synchronization error:', error);
      return null;
    }
  }, [getActiveUser, syncActiveUser]);

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
      
      // Update local state and storage
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem('mongoUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
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
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(profileData)
      });
 
      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
 
      const data = await response.json();
      
      // Synchronize with global state and local storage
      const updatedUser = { ...currentUser, ...data.user };
      localStorage.setItem('mongoUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
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
  async function adminLogin(email, password, otp) {
    try {
      const bodyData = otp ? { email, password, otp } : { email, password };
      const response = await fetch(`${BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Admin login failed');
      }

      if (data.requiresOtp) {
        return data;
      }

      // Store admin token and data
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminData', JSON.stringify(data.admin));
      setTimeout(() => syncActiveUser(), 0);

      return data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  async function adminRegister(name, email, password, otp) {
    try {
      const response = await fetch(`${BASE_URL}/admin/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, otp }),
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
  async function medicalOfficerLogin(email, password, otp) {
    try {
      const bodyData = otp ? { email, password, otp } : { email, password };
      const response = await fetch(`${BASE_URL}/medical-officer/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Medical officer login failed');
      }

      if (data.requiresOtp) {
        return data;
      }

      // Store medical officer token and data
      localStorage.setItem('medicalOfficerToken', data.token);
      localStorage.setItem('medicalOfficerData', JSON.stringify(data.medicalOfficer));
      // Trigger reactive activeUser update
      setTimeout(() => syncActiveUser(), 0);

      return data;
    } catch (error) {
      console.error('Medical officer login error:', error);
      throw error;
    }
  }

  async function medicalOfficerRegister(formData) { // formData will now include otp
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
    setTimeout(() => syncActiveUser(), 0);
  }

  useEffect(() => {
    // 1. Restore identity from various local storage slots
    const mongoUser = localStorage.getItem('mongoUser');
    const adminData = localStorage.getItem('adminData');
    const medicalOfficerData = localStorage.getItem('medicalOfficerData');

    if (mongoUser) {
      try {
        const parsed = JSON.parse(mongoUser);
        // Safety: Clear bloated storage if needed
        if (parsed.photoURL && parsed.photoURL.length > 100000) {
          localStorage.removeItem('mongoUser');
        } else {
          setCurrentUser(parsed);
        }
      } catch (e) {}
    }

    // 2. Initialize Firebase observer
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('userToken', token);
        setCurrentUser(user);
      } else {
        // Only clear currentUser if we don't have a persisted MongoDB user
        // AND we don't have an Admin or Medical Officer session active
        const hasMongo = !!localStorage.getItem('mongoUser');
        const hasAdmin = !!localStorage.getItem('adminToken');
        const hasMedical = !!localStorage.getItem('medicalOfficerToken');

        if (!hasMongo && !hasAdmin && !hasMedical) {
          localStorage.removeItem('userToken');
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    // If we have an Admin or Medical session, we can stop the initial loading early
    if (adminData || medicalOfficerData) {
      setLoading(false);
    }

    return unsubscribe;
  }, []);



  useEffect(() => {
    syncActiveUser();
  }, [currentUser, syncActiveUser]);

  // Listen for localStorage changes from other tabs or explicit updates
  useEffect(() => {
    const handleStorage = () => syncActiveUser();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [syncActiveUser]);

  const value = {
    currentUser,
    activeUser,
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
    verifyEmail,
    uploadProfilePicture,
    updateUserProfile,
    getUserProfile,
    refreshUser,
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
    medicalOfficerLogout,
    sendRegistrationOtp
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}



