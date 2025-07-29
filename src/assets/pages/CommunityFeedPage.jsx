// src/pages/CommunityFeedPage.jsx
import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaShareAlt } from 'react-icons/fa'; // For modern icons

const CommunityFeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    animalName: '',
    experience: '',
    photo: null,
  });
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({}); // { postId: [comments] }

  // Load posts and comments from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('wildlifePosts');
    const savedComments = localStorage.getItem('wildlifeComments');

    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedComments) setComments(JSON.parse(savedComments));
  }, []);

  // Save posts to localStorage
  const savePosts = (updatedPosts) => {
    setPosts(updatedPosts);
    localStorage.setItem('wildlifePosts', JSON.stringify(updatedPosts));
  };

  // Save comments to localStorage
  const saveComments = (updatedComments) => {
    setComments(updatedComments);
    localStorage.setItem('wildlifeComments', JSON.stringify(updatedComments));
  };

  // Handle new post submission
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.animalName.trim() || (!newPost.experience.trim() && !newPost.photo)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const photoDataUrl = reader.result;

      const post = {
        id: Date.now(),
        animalName: newPost.animalName,
        experience: newPost.experience,
        photo: photoDataUrl,
        author: 'Anonymous User',
        timestamp: new Date().toLocaleString(),
        likes: 0,
      };

      savePosts([post, ...posts]);
      setNewPost({ animalName: ' ', experience: '', photo: null });
    };

    if (newPost.photo) {
      reader.readAsDataURL(newPost.photo);
    } else {
      const post = {
        id: Date.now(),
        animalName: newPost.animalName,
        experience: newPost.experience,
        photo: null,
        author: 'Anonymous User',
        timestamp: new Date().toLocaleString(),
        likes: 0,
      };
      savePosts([post, ...posts]);
      setNewPost({ animalName: '', experience: '', photo: null });
    }
  };

  // Handle comment submission
  const handleCommentSubmit = (postId) => {
    if (!commentText.trim()) return;

    const updatedComments = { ...comments };
    if (!updatedComments[postId]) updatedComments[postId] = [];

    updatedComments[postId].push({
      id: Date.now(),
      author: 'Commenter',
      text: commentText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    saveComments(updatedComments);
    setCommentText('');
  };

  // Handle like button click
  const handleLike = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    savePosts(updatedPosts);
  };

  return (
    <div style={{
      fontFamily: '"Segoe UI", sans-serif',
      margin: 0,
      padding: 0,
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1a5f7a',
        color: 'white',
        padding: '15px 20px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '600' }}>🌿 Wildlife Sightings Community</h1>
        <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Share your wildlife encounters. Learn from others.</p>
      </div>

      {/* Create Post Form */}
      <div style={{
        maxWidth: '800px',
        width: '100%',
        marginTop: '20px',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}>
        <h3>📝 Share Your Wildlife Sighting</h3>
        <form onSubmit={handlePostSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Which animal did you see?"
            value={newPost.animalName}
            onChange={(e) => setNewPost({ ...newPost, animalName: e.target.value })}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              width: '100%',
            }}
            required
          />

          <textarea
            placeholder="Tell us about your experience or ask a question..."
            value={newPost.experience}
            onChange={(e) => setNewPost({ ...newPost, experience: e.target.value })}
            rows="3"
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontSize: '0.95rem' }}>📷 Add photo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewPost({ ...newPost, photo: e.target.files[0] })}
              style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '6px' }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#1a5f7a',
              color: 'white',
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Post Sighting
          </button>
        </form>
      </div>

      {/* Posts Feed */}
      <div style={{ maxWidth: '800px', width: '100%', marginTop: '20px' }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No sightings shared yet. Be the first to post!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              marginBottom: '20px',
            }}>
              {/* Post Header */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e4e6eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <strong style={{ color: '#1a5f7a' }}>{post.animalName}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#65676b' }}>
                    by {post.author} • {post.timestamp}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ cursor: 'pointer' }} onClick={() => handleLike(post.id)}>
                    <FaHeart size={18} color={post.likes > 0 ? '#ff6b6b' : '#ccc'} />{' '}
                    {post.likes}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div style={{ padding: '12px 16px' }}>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{post.experience}</p>

                {post.photo && (
                  <img
                    src={post.photo}
                    alt="Sighting"
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginTop: '10px',
                      border: '1px solid #ddd',
                    }}
                  />
                )}
              </div>

              {/* Comments Section */}
              <div style={{
                borderTop: '1px solid #e4e6eb',
                padding: '12px 16px',
                backgroundColor: '#f0f2f5',
                borderRadius: '0 0 10px 10px',
              }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>💬 Comments</h4>

                {/* Add Comment */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '20px',
                      border: '1px solid #ccc',
                      fontSize: '0.95rem',
                    }}
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    style={{
                      backgroundColor: '#1a5f7a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '0 12px',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                    }}
                  >
                    Post
                  </button>
                </div>

                {/* Display Comments */}
                {(comments[post.id] || []).length === 0 ? (
                  <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>No comments yet.</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {comments[post.id].map((comment) => (
                      <li key={comment.id} style={{
                        backgroundColor: 'white',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        marginBottom: '6px',
                        fontSize: '0.95rem',
                      }}>
                        <strong>{comment.author}</strong>
                        <span style={{ color: '#65676b', fontSize: '0.85rem', marginLeft: '8px' }}>
                          {comment.timestamp}
                        </span>
                        <p style={{ margin: '4px 0 0 0 ' }}>{comment.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityFeedPage;