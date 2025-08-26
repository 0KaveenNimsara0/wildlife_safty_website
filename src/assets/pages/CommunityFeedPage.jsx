import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaUser } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext';
import NestedComment from '../components/NestedComment';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

import UserPostsPage from './UserPostsPage';
import { FaBars, FaArrowLeft } from 'react-icons/fa';

const CommunityFeedPage = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/posts`);

        const postsWithNestedComments = response.data.map(post => {
          if (!post.comments) return post;

          const commentMap = {};
          post.comments.forEach(comment => {
            comment.replies = [];
            commentMap[comment._id] = comment;
          });

          const nestedComments = [];
          post.comments.forEach(comment => {
            if (comment.parentId) {
              const parent = commentMap[comment.parentId];
              if (parent) {
                parent.replies.push(comment);
              } else {
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

  const handleCommentSubmit = async (postId) => {
    const commentText = commentTexts[postId] || '';
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
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const hasUserLikedPost = (post) => {
    if (!currentUser || !post.likedBy) return false;
    return post.likedBy.includes(currentUser.uid);
  };

  // Utility to find comment by id in nested comments
  const findCommentById = (comment, id) => {
    if (comment._id === id) return comment;
    if (!comment.replies) return null;
    for (const reply of comment.replies) {
      const found = findCommentById(reply, id);
      if (found) return found;
    }
    return null;
  };

  // Utility to add a reply to the correct comment in nested comments
  const addReplyToComment = (comments, parentId, newReply) => {
    return comments.map(comment => {
      if (comment._id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, parentId, newReply)
        };
      }
      return comment;
    });
  };

  // Utility to update a comment in nested comments
  const updateCommentInTree = (comments, commentId, updatedComment) => {
    return comments.map(comment => {
      if (comment._id === commentId) {
        return updatedComment;
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentInTree(comment.replies, commentId, updatedComment)
        };
      }
      return comment;
    });
  };

  // Utility to remove a comment from nested comments
  const removeCommentFromTree = (comments, commentId) => {
    return comments
      .filter(comment => comment._id !== commentId)
      .map(comment => {
        if (comment.replies) {
          return {
            ...comment,
            replies: removeCommentFromTree(comment.replies, commentId)
          };
        }
        return comment;
      });
  };

  // Handle comment updates (reply, edit, delete)
  const handleReply = (parentId, newReply) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.comments?.some(c => c._id === parentId || findCommentById(c, parentId))) {
          return {
            ...post,
            comments: addReplyToComment(post.comments, parentId, newReply)
          };
        }
        return post;
      })
    );
  };

  const handleUpdateComment = (commentId, updatedComment) => {
    setPosts(prevPosts => 
      prevPosts.map(post => ({
        ...post,
        comments: updateCommentInTree(post.comments, commentId, updatedComment)
      }))
    );
  };

  const handleDeleteComment = (commentId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => ({
        ...post,
        comments: removeCommentFromTree(post.comments, commentId)
      }))
    );
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
      {/* Header - positioned under the main header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-20 z-40 w-full border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {currentUser && (
              <button
                onClick={() => setShowMyPosts(true)}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Open My Posts"
              >
                <FaBars size={20} className="text-green-700" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-green-700 flex items-center">
                <span className="mr-2">🌿</span> Wildlife Community Center
              </h1>
              
            </div>
          </div>
          {currentUser && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
                {currentUser.displayName?.charAt(0) || currentUser.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  {currentUser.displayName || currentUser.email.split('@')[0]}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} • {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* My Posts Sidebar */}
      {showMyPosts && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMyPosts(false)} />
          <div className="absolute left-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">My Posts</h2>
              <button
                onClick={() => setShowMyPosts(false)}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Close My Posts"
              >
                <FaArrowLeft size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="h-full overflow-y-auto">
              <UserPostsPage />
            </div>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-5">
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🦉</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No sightings yet</h3>
              <p className="text-gray-600 mb-4">Be the first to share your wildlife encounter!</p>
              {currentUser && (
                <Link 
                  to="/my-posts"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
                >
                  Create Your First Post
                </Link>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Post Header */}
                <div className="p-4 border-b border-gray-100 flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
                    {post.authorName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{post.animalName}</h4>
                    <p className="text-sm text-gray-600">{post.authorName}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      {/* <span className="text-gray-300">•</span>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p> */}
                      <span className="text-gray-300">•</span>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">{post.experience}</p>
                  {post.photoUrl && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={`${API_URL.replace('/api', '')}${post.photoUrl}`}
                        alt="Sighting"
                        className="w-full h-auto max-h-96 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="px-4 py-2 border-t border-gray-100 flex justify-between">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                      hasUserLikedPost(post) 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-500 hover:bg-gray-100'
                    } ${!currentUser ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={!currentUser || loading}
                  >
                    {hasUserLikedPost(post) ? <FaHeart /> : <FaRegHeart />}
                    <span className="text-sm">{post.likes || 0}</span>
                  </button>
                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 px-3 py-1 rounded-full hover:bg-gray-100">
                      <FaComment />
                      <span className="text-sm">Comment</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 px-3 py-1 rounded-full hover:bg-gray-100">
                      <FaShare />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                  {currentUser && (
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-700 font-medium text-sm">
                        {currentUser.displayName?.charAt(0) || currentUser.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 flex">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentTexts[post._id] || ''}
                          onChange={(e) => setCommentTexts(prev => ({ ...prev, [post._id]: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post._id)}
                          className="ml-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-full transition disabled:opacity-50"
                          disabled={loading || !(commentTexts[post._id] || '').trim()}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {(post.comments || []).map((comment) => (
                      <NestedComment
                        key={comment._id}
                        comment={comment}
                        postId={post._id}
                        onReply={handleReply}
                        onUpdate={handleUpdateComment}
                        onDelete={handleDeleteComment}
                        depth={0}
                        maxDepth={3}
                        postAuthorId={post.authorId}
                        currentUser={currentUser}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CommunityFeedPage;