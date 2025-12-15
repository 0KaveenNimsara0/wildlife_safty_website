import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { FaCamera } from 'react-icons/fa';  // Add this line

const API_URL = 'http://localhost:5000/api';

const UserPostsPage = () => {
  const { currentUser } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [newPost, setNewPost] = useState({ animalName: '', experience: '', photo: null });
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostData, setEditPostData] = useState({ animalName: '', experience: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/posts`);
        const filteredPosts = response.data.filter(post => post.authorId === currentUser.uid);
        setUserPosts(filteredPosts);
      } catch (err) {
        setError('Failed to fetch your posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [currentUser]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.animalName.trim() && !newPost.experience.trim() && !newPost.photo) return;

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('animalName', newPost.animalName);
      formData.append('experience', newPost.experience);
      formData.append('authorId', currentUser.uid);
      formData.append('authorName', currentUser.displayName || currentUser.email);
      if (newPost.photo) {
        formData.append('photo', newPost.photo);
      }

      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUserPosts([response.data, ...userPosts]);
      setNewPost({ animalName: '', experience: '', photo: null });
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setEditPostData({
      animalName: post.animalName,
      experience: post.experience
    });
  };

  const handleUpdatePost = async (postId) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/posts/${postId}`, {
        animalName: editPostData.animalName,
        experience: editPostData.experience
      });

      const updatedPosts = userPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            animalName: response.data.animalName,
            experience: response.data.experience,
            updatedAt: response.data.updatedAt
          };
        }
        return post;
      });

      setUserPosts(updatedPosts);
      setEditingPostId(null);
    } catch (err) {
      setError('Failed to update post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/posts/${postId}`);

      const updatedPosts = userPosts.filter(post => post._id !== postId);
      setUserPosts(updatedPosts);
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Your Wildlife Sightings</h2>
        
        {/* Create Post Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              Share a new wildlife encounter
            </h3>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Which animal did you see?"
                value={newPost.animalName}
                onChange={(e) => setNewPost({ ...newPost, animalName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />

              <textarea
                placeholder="Tell us about your experience..."
                value={newPost.experience}
                onChange={(e) => setNewPost({ ...newPost, experience: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-green-600 transition">
                  <FaCamera className="text-lg" />
                  <span className="text-sm font-medium">Add photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewPost({ ...newPost, photo: e.target.files[0] })}
                    className="hidden"
                  />
                </label>
                {newPost.photo && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Photo selected
                  </span>
                )}
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Share'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* User Posts */}
        <div className="space-y-5">
          {userPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🦉</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">Share your first wildlife encounter!</p>
            </div>
          ) : (
            userPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Post Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
                      {post.authorName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {editingPostId === post._id ? (
                          <input
                            type="text"
                            value={editPostData.animalName}
                            onChange={(e) => setEditPostData({...editPostData, animalName: e.target.value})}
                            className="font-semibold text-green-700 bg-gray-100 px-2 py-1 rounded text-base"
                          />
                        ) : (
                          post.animalName
                        )}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        {post.updatedAt && post.updatedAt !== post.createdAt && (
                          <span className="text-gray-400 ml-1">(edited)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {editingPostId === post._id ? (
                      <>
                        <button 
                          onClick={() => handleUpdatePost(post._id)}
                          className="text-green-600 hover:text-green-700 p-1 rounded-full hover:bg-green-50"
                        >
                          <FaCheck size={14} />
                        </button>
                        <button 
                          onClick={() => setEditingPostId(null)}
                          className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        >
                          <FaTimes size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEditPost(post)}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeletePost(post._id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        >
                          <FaTrash size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4">
                  {editingPostId === post._id ? (
                    <textarea
                      value={editPostData.experience}
                      onChange={(e) => setEditPostData({...editPostData, experience: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">{post.experience}</p>
                  )}
                  {post.photoUrl && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
<img
  src={`http://localhost:5000${post.photoUrl}`}
  alt="Sighting"
  className="w-full h-auto max-h-96 object-cover"
/>
                    </div>
                  )}
                </div>

                {/* Post Stats */}
                <div className="px-4 py-2 border-t border-gray-100 flex gap-4">
                  <div className="flex items-center gap-1 text-gray-500">
                    <FaHeart className="text-red-500" />
                    <span className="text-sm">{post.likes || 0} likes</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <FaComment />
                    <span className="text-sm">{post.comments?.length || 0} comments</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPostsPage;