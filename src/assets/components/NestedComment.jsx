import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaReply, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const NestedComment = ({ 
  comment, 
  postId, 
  onReply, 
  onUpdate, 
  onDelete, 
  depth = 0, 
  maxDepth = 3,
  postAuthorId
}) => {
  const { currentUser } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editingText, setEditingText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeReaction, setActiveReaction] = useState(null);

  const isAuthor = currentUser && comment.authorId === currentUser.uid;
  const isPostAuthor = comment.authorId === postAuthorId;
  const canReply = depth < maxDepth;

  // Format timestamp to match CommunityFeedPage
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000; // difference in seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleReaction = async (postId, commentId, reactionType) => {
  if (!currentUser) return;
  
  try {
    setLoading(true);
    const endpoint = commentId 
      ? `${API_URL}/posts/${postId}/comments/${commentId}/react`
      : `${API_URL}/posts/${postId}/react`;

    const response = await axios.post(endpoint, {
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email,
      type: reactionType
    });
    
    // Update state based on whether it's a post or comment reaction
    if (commentId) {
      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment._id === commentId) {
                return response.data;
              }
              // Handle nested replies
              if (comment.replies) {
                return {
                  ...comment,
                  replies: comment.replies.map(reply => {
                    if (reply._id === commentId) {
                      return response.data;
                    }
                    return reply;
                  })
                };
              }
              return comment;
            })
          };
        }
        return post;
      }));
    } else {
      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          return response.data;
        }
        return post;
      }));
    }
  } catch (err) {
    console.error('Failed to add reaction:', err);
  } finally {
    setLoading(false);
  }
};

  // Handle reply submission
  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/posts/${postId}/comments`, {
        parentId: comment._id,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
        text: replyText
      });
      
      onReply(comment._id, response.data);
      setReplyText('');
      setShowReplyInput(false);
    } catch (err) {
      console.error('Failed to add reply:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = async () => {
    if (!editingText.trim()) return;
    
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/posts/${postId}/comments/${comment._id}`, {
        text: editingText
      });
      
      onUpdate(comment._id, response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to edit comment:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/posts/${postId}/comments/${comment._id}`);
      onDelete(comment._id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get user's reaction
  const userReaction = comment.reactions?.find(r => r.userId === currentUser?.uid)?.type;

  // Calculate reaction counts
  const reactionCounts = {};
  if (comment.reactions) {
    comment.reactions.forEach(reaction => {
      reactionCounts[reaction.type] = (reactionCounts[reaction.type] || 0) + 1;
    });
  }

  const reactionIcons = {
    like: '👍',
    love: '❤️',
    laugh: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😡'
  };

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-gray-200' : ''} transition-all duration-150`}>
      <div className={`bg-white rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow ${
        depth % 2 === 0 ? 'border border-gray-200' : 'bg-gray-50'
      }`}>
        {/* Comment Header */}
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
            isPostAuthor ? 'bg-green-600' : 'bg-blue-600'
          }`}>
            {comment.authorName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800 truncate">
                  {comment.authorName}
                  {isPostAuthor && (
                    <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      OP
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(comment.createdAt)}
                </span>
                {comment.isEdited && (
                  <span className="text-xs text-gray-400">(edited)</span>
                )}
              </div>
              
              {isAuthor && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleEdit}
                        disabled={loading}
                        className="p-1 text-green-600 hover:text-green-700 rounded-full hover:bg-green-50"
                        aria-label="Save edit"
                      >
                        <FaCheck size={14} />
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="p-1 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                        aria-label="Cancel edit"
                      >
                        <FaTimes size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="p-1 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50"
                        aria-label="Edit comment"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button 
                        onClick={handleDelete}
                        className="p-1 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                        aria-label="Delete comment"
                      >
                        <FaTrash size={14} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Comment Content */}
            {isEditing ? (
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="w-full mt-2 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                autoFocus
              />
            ) : (
              <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap break-words">
                {comment.text}
              </p>
            )}
            
            {/* Comment Actions */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {/* Reactions */}
                <div className="relative">
                  <button
                    onClick={() => setActiveReaction(activeReaction ? null : 'like')}
                    className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full ${
                      userReaction ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    disabled={!currentUser || loading}
                  >
                    {userReaction ? (
                      <>
                        <span>{reactionIcons[userReaction]}</span>
                        <span>{reactionCounts[userReaction] || 1}</span>
                      </>
                    ) : (
                      <>
                        <FaRegHeart size={12} />
                        <span>Like</span>
                      </>
                    )}
                  </button>

                  {activeReaction && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-full px-2 py-1 flex gap-1 border border-gray-200 z-10">
                      {Object.entries(reactionIcons).map(([type, icon]) => (
                        <button
                          key={type}
                          onClick={() => handleReaction(type)}
                          className={`text-lg p-1 rounded-full transform transition ${
                            userReaction === type 
                              ? 'scale-125 bg-blue-50' 
                              : 'hover:scale-110 hover:bg-gray-100'
                          }`}
                          title={type}
                          disabled={!currentUser || loading}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Other reactions count */}
                {Object.entries(reactionCounts).filter(([type]) => type !== userReaction).length > 0 && (
                  <div className="flex gap-1">
                    {Object.entries(reactionCounts)
                      .filter(([type]) => type !== userReaction)
                      .map(([type, count]) => (
                        <span 
                          key={type} 
                          className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          {reactionIcons[type]} {count}
                        </span>
                      ))}
                  </div>
                )}
              </div>
              
              {/* Reply button */}
              {canReply && currentUser && (
                <button
                  onClick={() => {
                    setShowReplyInput(!showReplyInput);
                    if (!showReplyInput) {
                      setTimeout(() => document.getElementById(`reply-input-${comment._id}`)?.focus(), 100);
                    }
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-blue-50"
                  disabled={loading}
                >
                  <FaReply size={12} />
                  <span>Reply</span>
                </button>
              )}
            </div>
            
            {/* Reply Input */}
            {showReplyInput && canReply && (
              <div className="mt-3">
                <div className="flex gap-2">
                  <input
                    id={`reply-input-${comment._id}`}
                    type="text"
                    placeholder="Write your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim() || loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    Post
                  </button>
                  <button
                    onClick={() => setShowReplyInput(false)}
                    className="text-gray-600 hover:text-gray-700 text-xs px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map(reply => (
            <NestedComment
              key={reply._id}
              comment={reply}
              postId={postId}
              onReply={onReply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              depth={depth + 1}
              maxDepth={maxDepth}
              postAuthorId={postAuthorId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NestedComment;