import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext';
import NestedComment from '../components/NestedComment';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL

const CommunityFeedPage = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ animalName: '', experience: '', photo: null });
  const [commentText, setCommentText] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editPostData, setEditPostData] = useState({ animalName: '', experience: '' });
  const [editCommentText, setEditCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch posts from MongoDB
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/posts`);

        // Convert flat comments array to nested structure for each post
        const postsWithNestedComments = response.data.map(post => {
          if (!post.comments) return post;

          // Build a map of commentId to comment
          const commentMap = {};
          post.comments.forEach(comment => {
            comment.replies = [];
            commentMap[comment._id] = comment;
          });

          // Build nested comment tree
          const nestedComments = [];
          post.comments.forEach(comment => {
            if (comment.parentId) {
              const parent = commentMap[comment.parentId];
              if (parent) {
                parent.replies.push(comment);
              } else {
                // If parent not found, treat as top-level
                nestedComments.push(comment);
              }
            } else {
              nestedComments.push(comment);
            }
          });

          return {
            ...post,
            comments: nestedComments
          };
        });

        setPosts(postsWithNestedComments);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
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

      setPosts([response.data, ...posts]);
      setNewPost({ animalName: '', experience: '', photo: null });
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle post edit
  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setEditPostData({
      animalName: post.animalName,
      experience: post.experience
    });
  };

  // Handle post update
  const handleUpdatePost = async (postId) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/posts/${postId}`, {
        animalName: editPostData.animalName,
        experience: editPostData.experience
      });

      const updatedPosts = posts.map(post => {
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

      setPosts(updatedPosts);
      setEditingPostId(null);
    } catch (err) {
      setError('Failed to update post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle post delete
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/posts/${postId}`);

      const updatedPosts = posts.filter(post => post._id !== postId);
      setPosts(updatedPosts);
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (postId) => {
    if (!currentUser || !commentText.trim()) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/posts/${postId}/comments`, {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
        text: commentText
      });

      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), response.data]
          };
        }
        return post;
      });

      setPosts(updatedPosts);
      setCommentText('');
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle comment edit
  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.text);
  };

  // Handle comment update
  const handleUpdateComment = async (postId, commentId) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/posts/${postId}/comments/${commentId}`, {
        text: editCommentText
      });

      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  text: response.data.text,
                  updatedAt: response.data.updatedAt,
                  isEdited: true
                };
              }
              return comment;
            })
          };
        }
        return post;
      });

      setPosts(updatedPosts);
      setEditingCommentId(null);
    } catch (err) {
      setError('Failed to update comment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle comment delete
  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`);

      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.filter(comment => comment._id !== commentId)
          };
        }
        return post;
      });

      setPosts(updatedPosts);
    } catch (err) {
      setError('Failed to delete comment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle like/unlike post
  const handleLike = async (postId) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/posts/${postId}/like`, {
        userId: currentUser.uid
      });

      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: response.data.likes,
            likedBy: response.data.likedBy
          };
        }
        return post;
      });

      setPosts(updatedPosts);
    } catch (err) {
      setError('Failed to update like');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle like/unlike comment
  const handleLikeComment = async (postId, commentId) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/posts/${postId}/comments/${commentId}/like`, {
        userId: currentUser.uid
      });

      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  likes: response.data.likes,
                  likedBy: response.data.likedBy
                };
              }
              return comment;
            })
          };
        }
        return post;
      });

      setPosts(updatedPosts);
    } catch (err) {
      setError('Failed to update comment like');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Check if current user has liked a post
  const hasUserLikedPost = (post) => {
    if (!currentUser || !post.likedBy) return false;
    return post.likedBy.includes(currentUser.uid);
  };

  // Check if current user has liked a comment
  const hasUserLikedComment = (comment) => {
    if (!currentUser || !comment.likedBy) return false;
    return comment.likedBy.includes(currentUser.uid);
  };

  // Check if current user is the author of a post
  const isPostAuthor = (post) => {
    return currentUser && post.authorId === currentUser.uid;
  };

  // Check if current user is the author of a comment
  const isCommentAuthor = (comment) => {
    return currentUser && comment.authorId === currentUser.uid;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading community feed...</p>
        </div>
      </div>
    );
  }

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
                required
              />

              <textarea
                placeholder="Tell us about your experience..."
                value={newPost.experience}
                onChange={(e) => setNewPost({ ...newPost, experience: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Sighting'}
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

      {/* Error Message */}
      {error && (
        <div className="max-w-3xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No sightings yet. Be the first to share!</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Post Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    {editingPostId === post._id ? (
                      <input
                        type="text"
                        value={editPostData.animalName}
                        onChange={(e) => setEditPostData({...editPostData, animalName: e.target.value})}
                        className="font-semibold text-blue-700 bg-gray-100 px-2 py-1 rounded"
                      />
                    ) : (
                      <h4 className="font-semibold text-blue-700">{post.animalName}</h4>
                    )}
                    <p className="text-xs text-gray-500">
                      by {post.authorName} • {new Date(post.createdAt).toLocaleString()}
                      {post.updatedAt && post.updatedAt !== post.createdAt && ' • edited'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-1 transition ${
                        currentUser 
                          ? hasUserLikedPost(post) 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-gray-400 hover:text-red-500'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                      disabled={!currentUser || loading}
                    >
                      {hasUserLikedPost(post) ? <FaHeart /> : <FaRegHeart />}
                      <span className="text-sm">{post.likes || 0}</span>
                    </button>
                    {isPostAuthor(post) && (
                      <div className="flex gap-1 ml-2">
                        {editingPostId === post._id ? (
                          <>
                            <button 
                              onClick={() => handleUpdatePost(post._id)}
                              className="text-green-600 hover:text-green-700"
                              disabled={loading}
                            >
                              <FaCheck size={14} />
                            </button>
                            <button 
                              onClick={() => setEditingPostId(null)}
                              className="text-red-600 hover:text-red-700"
                              disabled={loading}
                            >
                              <FaTimes size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleEditPost(post)}
                              className="text-blue-600 hover:text-blue-700"
                              disabled={loading}
                            >
                              <FaEdit size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeletePost(post._id)}
                              className="text-red-600 hover:text-red-700"
                              disabled={loading}
                            >
                              <FaTrash size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                {editingPostId === post._id ? (
                  <textarea
                    value={editPostData.experience}
                    onChange={(e) => setEditPostData({...editPostData, experience: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-800 leading-relaxed">{post.experience}</p>
                )}
                {post.photoUrl && (
                  <img
                    src={`${API_URL.replace('/api', '')}${post.photoUrl}`}
                    alt="Sighting"
                    className="mt-3 w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                )}
              </div>

              {/* Comments Section */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                  <FaComment className="text-gray-500" /> Comments ({post.comments?.length || 0})
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
                      onClick={() => handleCommentSubmit(post._id)}
                      className="bg-gray-700 hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full transition disabled:opacity-50"
                      disabled={loading}
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
                {(post.comments || []).map((comment) => (
                  <NestedComment
                    key={comment._id}
                    comment={comment}
                    postId={post._id}
                    onReply={(parentId, newComment) => {
                      const updatedPosts = posts.map(p => {
                        if (p._id === post._id) {
                          // Add reply to the correct comment's replies array
                          const addReply = (comments) => {
                            return comments.map(c => {
                              if (c._id === parentId) {
                                const replies = c.replies ? [...c.replies, newComment] : [newComment];
                                return { ...c, replies };
                              } else if (c.replies) {
                                return { ...c, replies: addReply(c.replies) };
                              }
                              return c;
                            });
                          };
                          return {
                            ...p,
                            comments: addReply(p.comments || [])
                          };
                        }
                        return p;
                      });
                      setPosts(updatedPosts);
                    }}
                    onUpdate={(commentId, updatedComment) => {
                      const updatedPosts = posts.map(p => {
                        if (p._id === post._id) {
                          const updateComment = (comments) => {
                            return comments.map(c => {
                              if (c._id === commentId) {
                                // Merge updatedComment deeply to preserve nested replies
                                return { 
                                  ...c, 
                                  ...updatedComment,
                                  replies: updatedComment.replies || c.replies || []
                                };
                              } else if (c.replies) {
                                return { ...c, replies: updateComment(c.replies) };
                              }
                              return c;
                            });
                          };
                          return {
                            ...p,
                            comments: updateComment(p.comments || [])
                          };
                        }
                        return p;
                      });
                      setPosts(updatedPosts);
                    }}
                    onDelete={(commentId) => {
                      const updatedPosts = posts.map(p => {
                        if (p._id === post._id) {
                          const deleteComment = (comments) => {
                            return comments.filter(c => c._id !== commentId).map(c => {
                              if (c.replies) {
                                return { ...c, replies: deleteComment(c.replies) };
                              }
                              return c;
                            });
                          };
                          return {
                            ...p,
                            comments: deleteComment(p.comments || [])
                          };
                        }
                        return p;
                      });
                      setPosts(updatedPosts);
                    }}
                    
                    isAuthor={isCommentAuthor(comment)}
                    hasLiked={hasUserLikedComment(comment)}
                    
                  />
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