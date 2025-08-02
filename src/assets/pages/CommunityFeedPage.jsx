// src/pages/CommunityFeedPage.jsx
import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext'; // Import useAuth hook

const CommunityFeedPage = () => {
  const { currentUser } = useAuth(); // Get current user from AuthContext
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ animalName: '', experience: '', photo: null });
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({});
  const [userLikes, setUserLikes] = useState({}); // Track user likes

  // Load from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('wildlifePosts');
    const savedComments = localStorage.getItem('wildlifeComments');
    const savedUserLikes = localStorage.getItem('userLikes');
    
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedComments) setComments(JSON.parse(savedComments));
    if (savedUserLikes) setUserLikes(JSON.parse(savedUserLikes));
  }, []);

  const savePosts = (updated) => {
    setPosts(updated);
    localStorage.setItem('wildlifePosts', JSON.stringify(updated));
  };

  const saveComments = (updated) => {
    setComments(updated);
    localStorage.setItem('wildlifeComments', JSON.stringify(updated));
  };

  const saveUserLikes = (updated) => {
    setUserLikes(updated);
    localStorage.setItem('userLikes', JSON.stringify(updated));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.animalName.trim() && !newPost.experience.trim() && !newPost.photo) return;

    const reader = new FileReader();
    reader.onload = () => {
      const photoData = reader.result;
      const post = {
        id: Date.now(),
        animalName: newPost.animalName || 'Unknown Animal',
        experience: newPost.experience,
        photo: photoData,
        author: currentUser ? (currentUser.displayName || currentUser.email) : 'Anonymous',
        timestamp: new Date().toLocaleString(),
        likes: 0,
      };
      savePosts([post, ...posts]);
      setNewPost({ animalName: '', experience: '', photo: null });
    };

    if (newPost.photo) {
      reader.readAsDataURL(newPost.photo);
    } else {
      const post = {
        id: Date.now(),
        animalName: newPost.animalName || 'Unknown Animal',
        experience: newPost.experience,
        photo: null,
        author: currentUser ? (currentUser.displayName || currentUser.email) : 'Anonymous',
        timestamp: new Date().toLocaleString(),
        likes: 0,
      };
      savePosts([post, ...posts]);
      setNewPost({ animalName: '', experience: '', photo: null });
    }
  };

  const handleCommentSubmit = (postId) => {
    if (!commentText.trim()) return;
    if (!currentUser) return; // Only logged-in users can comment
    
    const updated = { ...comments };
    if (!updated[postId]) updated[postId] = [];
    updated[postId].unshift({
      id: Date.now(),
      author: currentUser.displayName || currentUser.email,
      text: commentText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    saveComments(updated);
    setCommentText('');
  };

  const handleLike = (postId) => {
    if (!currentUser) return; // Only logged-in users can like posts
    
    const userId = currentUser.uid;
    const updatedUserLikes = { ...userLikes };
    
    // Initialize user likes for this post if not exists
    if (!updatedUserLikes[userId]) {
      updatedUserLikes[userId] = [];
    }
    
    // Check if user already liked this post
    const userLikedPostIndex = updatedUserLikes[userId].indexOf(postId);
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return; // Post not found
    
    const updatedPosts = [...posts];
    
    if (userLikedPostIndex === -1) {
      // User hasn't liked this post yet, add like
      updatedUserLikes[userId].push(postId);
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        likes: updatedPosts[postIndex].likes + 1
      };
    } else {
      // User already liked this post, remove like
      updatedUserLikes[userId].splice(userLikedPostIndex, 1);
      updatedPosts[postIndex] = {
        ...updatedPosts[postIndex],
        likes: updatedPosts[postIndex].likes - 1
      };
    }
    
    savePosts(updatedPosts);
    saveUserLikes(updatedUserLikes);
  };

  // Check if current user has liked a specific post
  const hasUserLikedPost = (postId) => {
    if (!currentUser || !userLikes[currentUser.uid]) return false;
    return userLikes[currentUser.uid].includes(postId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Create Post - Only visible to logged-in users */}
      {currentUser ? (
        <div className="max-w-3xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                📸 Share a Sighting
              </h3>
            </div>

            <form onSubmit={handlePostSubmit} className="p-4 space-y-4">
              <input
                type="text"
                placeholder="Which animal did you see?"
                value={newPost.animalName}
                onChange={(e) => setNewPost({ ...newPost, animalName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <textarea
                placeholder="Tell us about your experience..."
                value={newPost.experience}
                onChange={(e) => setNewPost({ ...newPost, experience: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <label className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                  🖼️ Add photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewPost({ ...newPost, photo: e.target.files[0] })}
                    className="hidden"
                  />
                </label>
                {newPost.photo && (
                  <span className="text-xs text-green-600">✓ Photo selected</span>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Post Sighting
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                🔒 Community Feed
              </h3>
            </div>
            <div className="p-4 text-center">
              <p className="text-gray-600 mb-4">
                Sign in to share wildlife sightings, comment, and like posts!
              </p>
              <p className="text-sm text-gray-500">
                You can still view posts and comments without signing in.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No sightings yet. Be the first to share!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Post Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-700">{post.animalName}</h4>
                    <p className="text-xs text-gray-500">
                      by {post.author} • {post.timestamp}
                    </p>
                  </div>
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 transition ${
                      currentUser 
                        ? hasUserLikedPost(post.id) 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-red-500'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                    disabled={!currentUser}
                  >
                    {hasUserLikedPost(post.id) ? <FaHeart /> : <FaRegHeart />}
                    <span className="text-sm">{post.likes}</span>
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <p className="text-gray-800 leading-relaxed">{post.experience}</p>
                {post.photo && (
                  <img
                    src={post.photo}
                    alt="Sighting"
                    className="mt-3 w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                )}
              </div>

              {/* Comments Section */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                  <FaComment className="text-gray-500" /> Comments
                </h5>

                {/* Add Comment - Only for logged-in users */}
                {currentUser ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="bg-gray-700 hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full transition"
                    >
                      Post
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">
                      Sign in to comment on posts
                    </p>
                  </div>
                )}

                {/* Comments List */}
                <ul className="mt-4 space-y-3">
                  {(comments[post.id] || []).map((c) => (
                    <li key={c.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex justify-between">
                        <strong className="text-sm text-gray-800">{c.author}</strong>
                        <span className="text-xs text-gray-500">{c.timestamp}</span>
                      </div>
                      <p className="text-gray-700 text-sm mt-1">{c.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityFeedPage;