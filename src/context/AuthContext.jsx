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

import { BASE_URL, IMAGE_BASE_URL } from '../config/constants';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getActiveUser = () => {
    if (currentUser) {
      const isMongoUser = localStorage.getItem("mongoUser");
      const user = {
        uid: currentUser.uid || currentUser._id,
        displayName: currentUser.displayName || currentUser.name || currentUser.email,
        email: currentUser.email,
        emailVerified: currentUser.emailVerified ?? false,
        role: "user",
        source: isMongoUser ? "mongodb" : "firebase",
        createdAt: currentUser.createdAt || currentUser.metadata?.creationTime || new Date().toISOString(),
        ...currentUser
      };

      // Process photoURL if it's a relative path from our disk storage
      if (user.photoURL && user.photoURL.startsWith('/uploads')) {
        user.photoURL = `${IMAGE_BASE_URL}${user.photoURL}`;
      }
      return user;
    }
    const adminData = localStorage.getItem("adminData");
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        return {
          uid: parsed._id || parsed.id,
          displayName: parsed.name,
          email: parsed.email,
          emailVerified: parsed.emailVerified ?? false,
          role: "admin",
          source: "mongodb",
          ...parsed
        };
      } catch (e) {}
    }
    const medicalData = localStorage.getItem("medicalOfficerData");
    if (medicalData) {
      try {
        const parsed = JSON.parse(medicalData);
        return {
          uid: parsed._id || parsed.id,
          displayName: parsed.name,
          email: parsed.email,
          emailVerified: parsed.emailVerified ?? false,
          role: "medicalOfficer",
          source: "mongodb",
          ...parsed
        };
      } catch (e) {}
    }
    return null;
  };

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

  function updateUserPassword(password) {
    return updatePassword(currentUser, password);
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

  async function refreshUser() {
    try {
      const active = getActiveUser();
      if (!active || !active.uid) return;

      let endpoint = `/users/${active.uid}`;
      if (active.role === 'admin') endpoint = `/admin/users/${active.uid}`;
      else if (active.role === 'medicalOfficer') endpoint = `/medical-officer/auth/profile`; // Generic profile uses token

      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error('Identity synchronization failed');
      
      const data = await response.json();
      const updatedData = data.user || data;

      if (active.role === "admin") {
        localStorage.setItem("adminData", JSON.stringify(updatedData));
      } else if (active.role === "medicalOfficer") {
        localStorage.setItem("medicalOfficerData", JSON.stringify(updatedData));
      } else {
        localStorage.setItem("mongoUser", JSON.stringify(updatedData));
        setCurrentUser(updatedData);
      }
      
      return updatedData;
    } catch (error) {
      console.error('Deep-sync synchronization error:', error);
    }
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
  }

  useEffect(() => {
    // Check if we have a persisted MongoDB session
    const savedUser = localStorage.getItem('mongoUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        
        // Safety: If the photoURL is a massive base64 string, clear it once to fix QuotaExceededError
        if (parsedUser.photoURL && parsedUser.photoURL.length > 100000) {
          console.warn('Wiping bloated profile storage asset...');
          localStorage.removeItem('mongoUser');
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        // Process photoURL if it's a relative path from the disk storage
        if (parsedUser.photoURL && parsedUser.photoURL.startsWith('/uploads')) {
          parsedUser.photoURL = `${IMAGE_BASE_URL}${parsedUser.photoURL}`;
        }
        
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error('Failed to restore identity grid:', e);
      }
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

