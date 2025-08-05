import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaReply, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Helper function to convert timestamp to relative time string
const getRelativeTime = (date) => {
  const now = new Date();
  const diff = (now - new Date(date)) / 1000; // difference in seconds

  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return `${Math.floor(diff / 604800)}w`;
};

const NestedComment = ({ 
  comment, 
  postId, 
  onReply, 
  onUpdate, 
  onDelete, 
  depth = 0, 
  maxDepth = 3,
  postAuthorId // new prop to identify post author for badge
}) => {
  const { currentUser } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editingText, setEditingText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAuthor = currentUser && comment.authorId === currentUser.uid;
  const canReply = depth < maxDepth;

  // Handle reaction
  const handleReaction = async (reactionType) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/posts/${postId}/comments/${comment._id}/react`, {
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        type: reactionType
      });
      
      onUpdate(comment._id, response.data);
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

  // Calculate reaction counts from reactions array
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
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
            {comment.authorName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-sm text-gray-800">{comment.authorName}</strong>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {comment.isEdited && <span className="text-xs text-gray-400 ml-1">(edited)</span>}
              </div>
              
              {isAuthor && (
                <div className="flex gap-1">
                  {isEditing ? (
                    <>
                      <button onClick={handleEdit} className="text-green-600 hover:text-green-700 text-xs">
                        <FaCheck size={12} />
                      </button>
                      <button onClick={() => setIsEditing(false)} className="text-red-600 hover:text-red-700 text-xs">
                        <FaTimes size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-700 text-xs">
                        <FaEdit size={12} />
                      </button>
                      <button onClick={handleDelete} className="text-red-600 hover:text-red-700 text-xs">
                        <FaTrash size={12} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {isEditing ? (
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="w-full mt-2 p-2 text-sm border border-gray-300 rounded"
                rows="2"
              />
            ) : (
              <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
            )}
            
            {/* Reactions */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                {Object.entries(reactionIcons).map(([type, icon]) => (
                  <button
                    key={type}
                    onClick={() => handleReaction(type)}
                    className={`text-sm transition ${userReaction === type ? 'scale-125' : 'hover:scale-110'}`}
                    title={type}
                    disabled={!currentUser || loading}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              
              {Object.keys(reactionCounts).length > 0 && (
                <div className="flex gap-1 text-xs">
                  {Object.entries(reactionCounts).map(([type, count]) => (
                    <span key={type} className="bg-gray-100 px-2 py-1 rounded">
                      {reactionIcons[type]} {count}
                    </span>
                  ))}
                </div>
              )}
              
              {canReply && (
                <button
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <FaReply size={12} /> Reply
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Reply Input */}
        {showReplyInput && canReply && (
          <div className="mt-3 ml-11">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded"
              />
              <button
                onClick={handleReplySubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded"
                disabled={loading}
              >
                Reply
              </button>
              <button
                onClick={() => setShowReplyInput(false)}
                className="text-gray-600 hover:text-gray-700 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NestedComment;
