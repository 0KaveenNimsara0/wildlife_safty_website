import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaEdit, FaTrash, FaCheck, FaTimes, FaCamera, FaPlus, FaCloudUploadAlt, FaHistory } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Shield, MapPin, Search, Plus, Trash2, Edit3, CheckCircle, XCircle } from 'lucide-react';

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
        setError('Failed to sync your field logs.');
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
      if (newPost.photo) formData.append('photo', newPost.photo);

      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUserPosts([response.data, ...userPosts]);
      setNewPost({ animalName: '', experience: '', photo: null });
    } catch (err) {
      setError('Log entry failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setEditPostData({ animalName: post.animalName, experience: post.experience });
  };

  const handleUpdatePost = async (postId) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/posts/${postId}`, {
        animalName: editPostData.animalName,
        experience: editPostData.experience
      });
      setUserPosts(userPosts.map(post => post._id === postId ? { ...post, animalName: response.data.animalName, experience: response.data.experience, updatedAt: response.data.updatedAt } : post));
      setEditingPostId(null);
    } catch (err) {
      setError('Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this sighting record?')) return;
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/posts/${postId}`);
      setUserPosts(userPosts.filter(post => post._id !== postId));
    } catch (err) {
      setError('Deletion failed.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && userPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Personnel Data</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6 animate-fade-in">
      {/* Premium Logging Form */}
      <div className="card-premium p-8 relative overflow-hidden bg-white/50 backdrop-blur-sm border-emerald-100">
        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl text-white">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Post Encounter</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Sighting Database</p>
            </div>
          </div>

          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Species Identified (e.g., Spectacled Cobra)"
                value={newPost.animalName}
                onChange={(e) => setNewPost({ ...newPost, animalName: e.target.value })}
                className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:outline-none transition-all font-bold text-slate-800"
                required
              />
              <textarea
                placeholder="Observation details, behavior, and surroundings..."
                value={newPost.experience}
                onChange={(e) => setNewPost({ ...newPost, experience: e.target.value })}
                rows="4"
                className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl focus:border-emerald-500 focus:outline-none transition-all font-medium text-slate-600"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                  <FaCamera size={18} />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-700">Attach Evidence</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPost({ ...newPost, photo: e.target.files[0] })}
                  className="hidden"
                />
              </label>
              
              {newPost.photo && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  <CheckCircle size={10} /> Asset Staged
                </div>
              )}

              <button
                type="submit"
                className="btn-primary py-4 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
                disabled={loading}
              >
                {loading ? 'Transmitting...' : 'Log Sighting'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-bold">
          <XCircle size={18} /> {error}
        </div>
      )}

      {/* Personnel Records Feed */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <FaHistory className="text-slate-300" />
          <h4 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Operation History</h4>
        </div>

        {userPosts.length === 0 ? (
          <div className="text-center py-20 card-premium border-dashed border-2 border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No personal records found in current sector</p>
          </div>
        ) : (
          userPosts.map((post) => (
            <div key={post._id} className="card-premium p-0 overflow-hidden group hover:border-emerald-200 transition-all">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white font-black text-sm">
                    {post.animalName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    {editingPostId === post._id ? (
                      <input
                        type="text"
                        value={editPostData.animalName}
                        onChange={(e) => setEditPostData({...editPostData, animalName: e.target.value})}
                        className="font-black text-slate-900 bg-white border-2 border-emerald-500 px-3 py-1 rounded-lg outline-none"
                      />
                    ) : (
                      <h4 className="font-black text-slate-800">{post.animalName}</h4>
                    )}
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                      {post.createdAt ? (() => { try { return formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }); } catch { return 'Recent'; } })() : 'Historical'}
                      {post.updatedAt && post.updatedAt !== post.createdAt && " • EDITED"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {editingPostId === post._id ? (
                    <>
                      <button onClick={() => handleUpdatePost(post._id)} className="p-3 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-all"><FaCheck size={14}/></button>
                      <button onClick={() => setEditingPostId(null)} className="p-3 bg-rose-100 text-rose-700 rounded-xl hover:bg-rose-200 transition-all"><FaTimes size={14}/></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditPost(post)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-sky-600 hover:border-sky-500 rounded-xl transition-all shadow-sm"><Edit3 size={14}/></button>
                      <button onClick={() => handleDeletePost(post._id)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-500 rounded-xl transition-all shadow-sm"><Trash2 size={14}/></button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-8 space-y-6">
                {editingPostId === post._id ? (
                  <textarea
                    value={editPostData.experience}
                    onChange={(e) => setEditPostData({...editPostData, experience: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-3 bg-white border-2 border-emerald-500 rounded-2xl outline-none font-medium"
                  />
                ) : (
                  <p className="text-slate-600 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6">"{post.experience}"</p>
                )}
                
                {post.photoUrl && (
                  <div className="rounded-2xl overflow-hidden border-2 border-slate-50 shadow-inner group">
                    <img src={`http://localhost:5000${post.photoUrl}`} alt="Sighting Evidence" className="w-full h-auto max-h-80 object-cover group-hover:scale-102 transition-transform duration-700" />
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50/30 flex gap-6 px-8 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 group/label hover:text-rose-500 transition-colors">
                  <FaHeart className="text-rose-400 group-hover/label:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{post.likes || 0} LIKES</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 group/label hover:text-sky-500 transition-colors">
                  <FaComment className="text-sky-400 group-hover/label:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{post.comments?.length || 0} COMMENTS</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserPostsPage;