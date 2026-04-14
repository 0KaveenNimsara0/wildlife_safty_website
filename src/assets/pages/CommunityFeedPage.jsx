import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaArrowLeft, FaTimes, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext';
import NestedComment from '../components/NestedComment';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, MessageSquare, Share2, Heart, Award, ChevronRight, X, Shield, Activity, XCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import UserPostsPage from './UserPostsPage';

const API_URL = 'http://localhost:5000/api';

const fixedCategories = [
  'wildlife_safety',
  'medical_advice',
  'emergency_response',
  'prevention',
  'treatment'
];

const CommunityFeedPage = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // New states for articles sidebar
  const [selectedCategory, setSelectedCategory] = useState(fixedCategories[0]);
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [articlesError, setArticlesError] = useState('');
  const [popupArticle, setPopupArticle] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


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

  const fetchArticles = async () => {
    try {
      setArticlesLoading(true);
      const response = await axios.get(`${API_URL}/articles/category/${selectedCategory}`);
      setArticles(response.data.articles || []);
      setArticlesError('');
    } catch (err) {
      setArticlesError('Failed to fetch articles');
      console.error(err);
    } finally {
      setArticlesLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchArticles();
  }, [selectedCategory]);

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

      const newComment = response.data;

      // Update posts state
      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          fetchPosts(); // Trigger full refresh for simplicity to maintain state sync
          return post;
        }
        return post;
      }));

      // Update selectedPost if modal is open for this post
      if (selectedPost && selectedPost._id === postId) {
         fetchPosts(); // Ensure everything stays in sync
      }

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
      fetchPosts();
    } catch (err) {
      setError('Failed to update like');
    } finally {
      setLoading(false);
    }
  };

  // Restoring Tree-walking Utilities
  const findCommentById = (comment, id) => {
    if (comment._id === id) return comment;
    if (!comment.replies) return null;
    for (const reply of comment.replies) {
      const found = findCommentById(reply, id);
      if (found) return found;
    }
    return null;
  };

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

  const updateCommentInTree = (comments, commentId, updatedComment) => {
    return comments.map(comment => {
      if (comment._id === commentId) {
        return updatedComment;
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentInTree(comment.replies, commentId, updatedComment)
        };
      }
      return comment;
    });
  };

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

  const handleReply = (parentId, newReply) => { fetchPosts(); };
  const handleUpdateComment = (commentId, updatedComment) => { fetchPosts(); };
  const handleDeleteComment = (commentId) => { fetchPosts(); };

  const openArticlePopup = (article) => {
    setPopupArticle(article);
    setShowPopup(true);
  };

  const closeArticlePopup = () => {
    setShowPopup(false);
    setPopupArticle(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in text-slate-900">
      {/* Premium Header */}
      {/* Premium Header - Restored with My Posts trigger and Clock */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40 w-full border-b border-slate-200 mb-8 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            {currentUser && (
              <button
                onClick={() => setShowMyPosts(true)}
                className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 shadow-xl transition-all active:scale-95 flex items-center gap-2 group"
                aria-label="Open Field Records"
              >
                <Activity size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Field Records</span>
              </button>
            )}
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                Sector <span className="text-emerald-600">Intelligence</span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Shield size={12} className="text-emerald-500" />
                <span>Wildlife Community Center</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Real-time Intel Clock */}
            <div className="hidden lg:flex flex-col items-end text-right">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {currentUser && (
              <div className="flex items-center gap-4 bg-slate-50 pl-4 pr-1 py-1 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 hidden sm:inline">
                  {currentUser.displayName || currentUser.email.split('@')[0]}
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg">
                  {currentUser.displayName?.charAt(0) || currentUser.email.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-10">
        {/* Main Feed Sector - Left/Middle */}
        <div className="lg:col-span-8 space-y-8">
          {error && (
            <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-700 text-xs font-black uppercase tracking-widest text-center">
              {error}
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Feed Data</span>
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="p-20 text-center card-premium border-dashed border-2">
              <p className="text-slate-400 italic">No field logs detected in current region.</p>
            </div>
          )}

          {posts.map((post) => (
            <article key={post?._id || Math.random()} className="card-premium overflow-hidden group hover:border-emerald-200 transition-all">
              <header className="p-6 border-b border-slate-50 flex justify-between items-center group-hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-lg">
                    {post.authorName?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-black text-lg">{post.authorName}</h4>
                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">
                        <Award size={10} /> Certified Observer
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1">
                        <FaClock size={10} /> {post.createdAt ? (() => { try { return formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }); } catch { return 'Recent'; } })() : 'Historical'}
                      </span>
                    </div>
                  </div>
                </div>
              </header>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    {post.animalName}
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6">
                    "{post.experience}"
                  </p>
                </div>

                {post.photoUrl && (
                  <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-inner brightness-95 group-hover:brightness-100 transition-all duration-700">
                    <img src={`http://localhost:5000${post.photoUrl}`} alt="Observation Data" className="w-full h-auto max-h-[500px] object-cover" />
                  </div>
                )}
              </div>

              <footer className="p-4 bg-slate-50/30 flex items-center justify-between border-t border-slate-100 px-8">
                <div className="flex gap-8">
                  <button onClick={() => handleLike(post._id)} className="flex items-center gap-2 group/btn">
                    <div className="p-2.5 rounded-xl group-hover/btn:bg-rose-50 transition-all">
                      {currentUser && post.likedBy?.includes(currentUser.uid) ? <Heart size={20} className="fill-rose-500 text-rose-500" /> : <Heart size={20} className="text-slate-400 group-hover/btn:text-rose-500" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/btn:text-rose-600">{post.likes || 0} Verifications</span>
                  </button>
                  <button onClick={() => { setSelectedPost(post); setShowCommentsModal(true); }} className="flex items-center gap-2 group/btn">
                    <div className="p-2.5 rounded-xl group-hover/btn:bg-sky-50 transition-all">
                      <MessageSquare size={20} className="text-slate-400 group-hover/btn:text-sky-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/btn:text-sky-600">{post.comments?.length || 0} Reports</span>
                  </button>
                </div>
                <div className="flex gap-4">
                  <button className="p-3 text-slate-300 hover:text-emerald-500 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </footer>
              
              {/* Inline Quick Comment */}
              {currentUser && (
                <div className="px-8 pb-6 pt-2">
                   <div className="flex gap-4 p-1.5 bg-white rounded-2xl border-2 border-slate-100 ring-4 ring-slate-50">
                    <input
                      type="text"
                      placeholder="Add insight..."
                      value={commentTexts[post._id] || ''}
                      onChange={(e) => setCommentTexts(prev => ({ ...prev, [post._id]: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
                      className="flex-1 bg-transparent px-4 py-2 focus:outline-none font-bold text-slate-700 text-xs"
                    />
                    <button onClick={() => handleCommentSubmit(post._id)} className="bg-slate-900 text-white px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all">Post</button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Intelligence Sidebar - Restored with Categories and Article Popups */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="card-premium p-8 bg-slate-900 border-slate-800 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-3">
                <BookOpen className="text-emerald-400" size={20} />
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Briefings</h3>
              </div>
            </div>

            <div className="space-y-6 mb-8 relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sector Classification</h4>
              <div className="flex flex-wrap gap-2">
                {fixedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-emerald-500/50 hover:text-emerald-400'
                    }`}
                  >
                    {cat.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-6 relative z-10">
              {articlesLoading ? (
                <div className="py-12 flex justify-center">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                articles.map((article) => (
                  <button 
                    key={article?._id || Math.random()} 
                    onClick={() => openArticlePopup(article)}
                    className="w-full text-left group space-y-3 p-4 rounded-2xl hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">INTEL REF: {article._id.slice(-4).toUpperCase()}</span>
                    </div>
                    <h4 className="text-sm font-black leading-tight group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{article.title}</h4>
                    <p className="text-[11px] text-white/40 line-clamp-2 italic leading-relaxed">"{article.excerpt}"</p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="card-premium p-8 border-dashed border-2 border-slate-200 bg-white">
             <div className="flex items-center gap-3 mb-6">
                <Shield size={16} className="text-emerald-600" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Security Clearance</h4>
             </div>
             <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
               Your field observations are peer-reviewed by our medical officers and research team for validity and impact.
             </p>
             <Link to="/home" className="w-full py-3 bg-slate-50 rounded-xl flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                Access HQ Console
                <ChevronRight size={12} />
             </Link>
          </div>
        </aside>
      </div>

      {/* Floating My Posts Drawer - Restored */}
      {showMyPosts && (
        <div className="fixed inset-0 z-[100] overflow-hidden flex justify-start">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowMyPosts(false)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
            <header className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Personal Chronicle</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Observer Data Logs</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMyPosts(false)}
                className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95"
              >
                <ArrowLeft size={24} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
               <UserPostsPage />
            </div>
          </div>
        </div>
      )}

      {/* Full Content Popup Overlay - Restored */}
      {showPopup && popupArticle && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[150] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-4 border-white flex flex-col relative group">
            {/* Header Area */}
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[10px]">
                  <Award size={14} />
                  <span>Sector Report: {popupArticle.category}</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-tight">{popupArticle.title}</h2>
              </div>
              <button 
                onClick={closeArticlePopup}
                className="p-5 bg-white rounded-[2rem] shadow-sm border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95"
              >
                <X size={28} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-xl font-medium leading-relaxed whitespace-pre-wrap italic mb-12 border-l-8 border-emerald-500 pl-10">
                  {popupArticle.excerpt}
                </p>
                <div className="text-slate-800 text-xl leading-[2.2] font-medium whitespace-pre-wrap font-serif">
                  {popupArticle.content}
                </div>
              </div>

              {popupArticle.images && popupArticle.images.length > 0 && (
                <div className="mt-16 space-y-10">
                  {popupArticle.images.map((img, idx) => (
                    <div key={idx} className="rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-inner group-hover:border-emerald-50 transition-colors">
                      <img
                        src={img.url}
                        alt={`Intelligence Brief ${idx + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-10 border-t border-slate-50 bg-slate-50/80 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authenticated Field Research</span>
              <button 
                onClick={closeArticlePopup}
                className="bg-slate-900 text-white px-12 py-4 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-600 shadow-2xl transition-all active:scale-95"
              >
                Acknowledge Intel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interaction Modal (Comments) - Restored with Dual Layout */}
      {showCommentsModal && selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCommentsModal(false)} />
          <div className="relative w-full max-w-5xl h-[85vh] overflow-hidden bg-white rounded-[3.5rem] shadow-2xl flex flex-col scale-in-center">
            <header className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white font-black text-2xl shadow-xl">
                    {selectedPost.authorName?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{selectedPost.animalName}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mt-1 flex items-center gap-2">
                       <Award size={14} /> Observer: {selectedPost.authorName}
                    </p>
                  </div>
              </div>
              <button onClick={() => setShowCommentsModal(false)} className="p-5 bg-white rounded-[2rem] shadow-sm border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95">
                <X size={28} />
              </button>
            </header>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
               {/* Left Segment: Field Log Detail */}
               <div className="w-full md:w-1/2 p-12 overflow-y-auto border-r border-slate-50 space-y-10 custom-scrollbar">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-lg w-fit">Observation Narrative</h4>
                    <p className="text-xl text-slate-700 font-medium leading-relaxed italic">"{selectedPost.experience}"</p>
                  </div>
                  {selectedPost.photoUrl && (
                    <div className="rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-xl">
                       <img src={`http://localhost:5000${selectedPost.photoUrl}`} alt="Observation Detail" className="w-full h-auto object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-12 pt-4">
                    <div className="space-y-1">
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Verifications</span>
                       <p className="text-2xl font-black text-slate-900">{selectedPost.likes || 0}</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Reports</span>
                       <p className="text-2xl font-black text-slate-900">{selectedPost.comments?.length || 0}</p>
                    </div>
                  </div>
               </div>

               {/* Right Segment: Collaborative Analysis (Comments) */}
               <div className="w-full md:w-1/2 p-12 flex flex-col space-y-10 overflow-hidden">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={20} className="text-emerald-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expert Consensus</h4>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pb-10">
                    {(selectedPost.comments || []).map((comment) => (
                      <NestedComment 
                        key={comment._id} 
                        comment={comment} 
                        postId={selectedPost._id} 
                        depth={0} 
                        maxDepth={4} 
                        currentUser={currentUser} 
                        onReply={handleReply} 
                        onUpdate={handleUpdateComment} 
                        onDelete={handleDeleteComment} 
                      />
                    ))}
                    {(!selectedPost.comments || selectedPost.comments.length === 0) && (
                      <div className="py-20 text-center space-y-4">
                         <MessageSquare size={48} className="mx-auto text-slate-100" />
                         <p className="text-xs font-black uppercase tracking-widest text-slate-300 italic">No expert analysis recorded</p>
                      </div>
                    )}
                  </div>

                  {currentUser && (
                    <div className="flex gap-4 p-2 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 ring-8 ring-white shadow-2xl">
                      <input
                        type="text"
                        placeholder="Add professional insight..."
                        value={commentTexts[selectedPost._id] || ''}
                        onChange={(e) => setCommentTexts(prev => ({ ...prev, [selectedPost._id]: e.target.value }))}
                        className="flex-1 bg-transparent px-8 py-5 focus:outline-none font-bold text-slate-800 text-sm"
                      />
                      <button onClick={() => handleCommentSubmit(selectedPost._id)} className="bg-slate-900 text-white px-10 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95">Analyze</button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeedPage;
