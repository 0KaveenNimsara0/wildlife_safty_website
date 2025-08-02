import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext';
import { db } from '../Database/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';

const CommunityFeedPage = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ animalName: '', experience: '', photo: null });
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch posts from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'posts'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const postsData = [];
        snapshot.forEach((doc) => {
          postsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setPosts(postsData);
      },
      (err) => {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts');
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newPost.animalName.trim() && !newPost.experience.trim()) return;

    try {
      setLoading(true);
      
      // For simplicity, we're not handling image uploads in this example
      // In a real app, you would integrate with Firebase Storage for images
      
      await addDoc(collection(db, 'posts'), {
        animalName: newPost.animalName,
        experience: newPost.experience,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
        createdAt: serverTimestamp(),
        likes: [],
        comments: []
      });

      setNewPost({ animalName: '', experience: '', photo: null });
    } catch (err) {
      setError('Failed to create post');
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
      
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          id: Date.now().toString(),
          authorId: currentUser.uid,
          authorName: currentUser.displayName || currentUser.email,
          text: commentText,
          createdAt: serverTimestamp()
        })
      });

      setCommentText('');
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle like/unlike
  const handleLike = async (postId) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        setError('Post not found');
        return;
      }
      
      const postData = postSnap.data();
      const userLiked = postData.likes?.includes(currentUser.uid);
      
      if (userLiked) {
        // Unlike the post
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid)
        });
      } else {
        // Like the post
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid)
        });
      }
    } catch (err) {
      setError('Failed to update like');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Check if current user has liked a post
  const hasUserLikedPost = (post) => {
    if (!currentUser || !post.likes) return false;
    return post.likes.includes(currentUser.uid);
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
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Post Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-700">{post.animalName}</h4>
                    <p className="text-xs text-gray-500">
                      by {post.authorName} • {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : 'Just now'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleLike(post.id)}
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
                    <span className="text-sm">{post.likes?.length || 0}</span>
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <p className="text-gray-800 leading-relaxed">{post.experience}</p>
                {/* Photo display would go here if implemented */}
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
                      onClick={() => handleCommentSubmit(post.id)}
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
                    <li key={comment.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex justify-between">
                        <strong className="text-sm text-gray-800">{comment.authorName}</strong>
                        <span className="text-xs text-gray-500">
                          {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
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
