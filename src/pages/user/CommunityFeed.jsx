import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL, IMAGE_BASE_URL } from '../../config/constants';
import NestedComment from '../../features/community/components/NestedComment';
import api from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, MessageSquare, Share2, Heart, Award, ChevronRight, X, Shield, Activity, ArrowLeft } from 'lucide-react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaArrowLeft, FaTimes, FaCalendarAlt, FaClock } from 'react-icons/fa';
import UserPosts from './UserPosts';

const fixedCategories = [
  'wildlife_safety',
  'medical_advice',
  'emergency_response',
  'prevention',
  'treatment'
];

const CommunityFeed = () => {
  const { activeUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMedicalOfficer, setIsMedicalOfficer] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [selectedCategory, setSelectedCategory] = useState(fixedCategories[0]);
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [articlesError, setArticlesError] = useState('');
  const [popupArticle, setPopupArticle] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const medicalData = localStorage.getItem('medicalOfficerData');
    if (medicalData) {
      setIsMedicalOfficer(true);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');

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
      const response = await api.get(`/articles/category/${selectedCategory}`);
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
    if (!activeUser || !commentText.trim()) return;

    try {
      setLoading(true);
      const response = await api.post(`/posts/${postId}/comments`, {
        authorId: activeUser.uid,
        authorName: activeUser.displayName || activeUser.email,
        authorRole: activeUser.role || 'user',
        text: commentText
      });

      const newComment = response.data;

      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), newComment]
          };
        }
        return post;
      }));

      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(prev => ({
          ...prev,
          comments: [...(prev.comments || []), newComment]
        }));
      }

      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
      fetchPosts();
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!activeUser) return;
    
    setPosts(prevPosts => prevPosts.map(post => {
      if (post._id === postId) {
        const isLiked = post.likedBy?.includes(activeUser.uid);
        const newLikes = isLiked ? Math.max(0, (post.likes || 1) - 1) : (post.likes || 0) + 1;
        const newLikedBy = isLiked 
          ? post.likedBy.filter(id => id !== activeUser.uid)
          : [...(post.likedBy || []), activeUser.uid];
          
        return { ...post, likes: newLikes, likedBy: newLikedBy };
      }
      return post;
    }));

    try {
      await api.post(`/posts/${postId}/like`, { userId: activeUser.uid });
    } catch (err) {
      console.error(err);
      fetchPosts();
    }
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
        return {
          ...comment,
          ...updatedComment,
          replies: comment.replies // Preserve manually populated nested replies tree
        };
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

  const handleReply = (commentId, newReply) => {
    setPosts(prevPosts => prevPosts.map(post => ({
      ...post,
      comments: addReplyToComment(post.comments || [], commentId, newReply)
    })));
    
    if (selectedPost) {
      setSelectedPost(prev => ({
        ...prev,
        comments: addReplyToComment(prev.comments || [], commentId, newReply)
      }));
    }
  };

  const handleUpdateComment = (commentId, updatedComment) => {
    setPosts(prevPosts => prevPosts.map(post => ({
      ...post,
      comments: updateCommentInTree(post.comments || [], commentId, updatedComment)
    })));

    if (selectedPost) {
      setSelectedPost(prev => ({
        ...prev,
        comments: updateCommentInTree(prev.comments || [], commentId, updatedComment)
      }));
    }
  };

  const handleDeleteComment = (commentId) => {
    setPosts(prevPosts => prevPosts.map(post => ({
      ...post,
      comments: removeCommentFromTree(post.comments || [], commentId)
    })));

    if (selectedPost) {
      setSelectedPost(prev => ({
        ...prev,
        comments: removeCommentFromTree(prev.comments || [], commentId)
      }));
    }
  };

  const handleVerifyPost = async (postId, status) => {
    try {
      console.log('Attempting verification for post:', postId, 'with status:', status);
      setLoading(true);
      const response = await api.post(`/posts/verify/${postId}`, { status });
      console.log('Verification response:', response.data);
      
      if (response.data) {
        setPosts(prevPosts => prevPosts.map(post => 
          post._id === postId ? { ...post, status: response.data.status } : post
        ));
        setSuccess(`Observation ${status === 'verified' ? 'verified' : 'rejected'} successfully.`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Expert verification failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const openArticlePopup = (article) => {
    setPopupArticle(article);
    setShowPopup(true);
  };

  const closeArticlePopup = () => {
    setShowPopup(false);
    setPopupArticle(null);
  };

  const handleReviewLater = (article) => {
    if (!article) return;
    const currentSaved = JSON.parse(localStorage.getItem('wildsafe_review_later') || '[]');
    if (!currentSaved.find(a => a._id === article._id)) {
      const newItem = {
        _id: article._id,
        title: article.title,
        category: article.category || selectedCategory,
        excerpt: article.excerpt,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('wildsafe_review_later', JSON.stringify([newItem, ...currentSaved]));
    }
    closeArticlePopup();
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in text-slate-900">
        <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40 w-full border-b border-slate-200 mb-8 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            {activeUser && (
              <button
                onClick={() => setShowMyPosts(true)}
                className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 shadow-xl transition-all active:scale-95 flex items-center gap-2 group hover:shadow-emerald-500/20"
                aria-label="Open Field Records"
              >
                <Activity size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Share Your Experience</span>
              </button>
            )}
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                Community <span className="text-emerald-600">Feed</span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Shield size={12} className="text-emerald-500" />
                <span>Wildlife Community Center</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex flex-col items-end text-right">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {activeUser && (
              <div className="flex items-center gap-4 bg-slate-50 pl-4 pr-1 py-1 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 hidden sm:inline">
                  {activeUser.displayName || activeUser.email.split('@')[0]}
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg">
                  {activeUser.displayName?.charAt(0) || activeUser.email.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {error && (
            <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-700 text-xs font-black uppercase tracking-widest text-center animate-shake">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl text-emerald-700 text-xs font-black uppercase tracking-widest text-center animate-fade-in">
              {success}
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
                      {post.status === 'verified' && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-sky-50 text-sky-600 px-2 py-0.5 rounded-md border border-sky-100 shadow-sm">
                          <Shield size={10} className="fill-sky-600/10" /> Verified Insight
                        </span>
                      )}
                      {post.status === 'rejected' && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md">
                          <X size={10} /> Discredited
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1">
                        <FaClock size={10} /> {post.createdAt ? (() => { try { return formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }); } catch { return 'Recent'; } })() : 'Historical'}
                      </span>
                    </div>
                  </div>
                </div>

                {isMedicalOfficer && post.status === 'pending' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleVerifyPost(post._id, 'verified')}
                      className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                    >
                      Verify
                    </button>
                    <button 
                      onClick={() => handleVerifyPost(post._id, 'rejected')}
                      className="px-4 py-2 bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </header>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    {post.animalName}
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6 break-all">
                    "{post.experience}"
                  </p>
                </div>

                {post.photoUrl && (
                  <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-inner brightness-95 group-hover:brightness-100 transition-all duration-700">
                    <img src={`${IMAGE_BASE_URL}${post.photoUrl}`} alt="Observation Data" className="w-full h-auto max-h-[500px] object-cover" />
                  </div>
                )}
              </div>

              <footer className="p-4 bg-slate-50/30 flex items-center justify-between border-t border-slate-100 px-8">
                <div className="flex gap-8">
                  <button onClick={() => handleLike(post._id)} className="flex items-center gap-2 group/btn">
                    <div className="p-2.5 rounded-xl group-hover/btn:bg-rose-50 transition-all">
                      {activeUser && post.likedBy?.includes(activeUser.uid) ? <Heart size={20} className="fill-rose-500 text-rose-500" /> : <Heart size={20} className="text-slate-400 group-hover/btn:text-rose-500" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/btn:text-rose-600">{post.likes || 0} Likes</span>
                  </button>
                  <button onClick={() => { setSelectedPost(post); setShowCommentsModal(true); }} className="flex items-center gap-2 group/btn">
                    <div className="p-2.5 rounded-xl group-hover/btn:bg-sky-50 transition-all duration-300 group-active/btn:scale-90">
                      <MessageSquare size={20} className="text-slate-400 group-hover/btn:text-sky-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/btn:text-sky-600">{post.comments?.length || 0} Comments</span>
                  </button>
                </div>
                <div className="flex gap-4">
                  <button className="p-3 text-slate-300 hover:text-emerald-500 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </footer>
              
              {activeUser && (
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

        <aside className="lg:col-span-4 space-y-8">
          <div className="card-premium p-8 bg-slate-900 border-slate-800 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-3">
                <BookOpen className="text-emerald-400" size={20} />
                <h3 className="text-sm text-white uppercase tracking-[0.2em]">Briefings</h3>
              </div>
            </div>

            <div className="space-y-6 mb-8 relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Categories</h4>
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
                       <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">REF: {article._id.slice(-4).toUpperCase()}</span>
                    </div>
                    <h4 className="text-sm text-white leading-tight group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{article.title}</h4>
                    <p className="text-[11px] text-white/40 line-clamp-2 italic leading-relaxed">"{article.excerpt}"</p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="card-premium p-8 border-dashed border-2 border-slate-200 bg-white group hover:border-emerald-300 transition-all duration-500">
             <div className="flex items-center gap-3 mb-6">
                <Shield size={16} className="text-emerald-600 transition-transform group-hover:scale-110" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Expert Verification</h4>
             </div>
             <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
               Your contributions are reviewed by experts to ensure high-quality safety guidance and valid species insights for the community.
             </p>
             <button onClick={() => setShowMyPosts(true)} className="w-full py-4 bg-slate-900 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200">
                View My Verified Posts
                <ChevronRight size={14} />
             </button>
          </div>
        </aside>
      </div>

      </div>

      {showMyPosts && (
        <div className="fixed inset-0 z-[1000] flex justify-start">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowMyPosts(false)} />
          <div className="relative w-full max-w-xl h-full bg-slate-50 shadow-2xl flex flex-col animate-slide-in-left">
            <header className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Posts</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shared Experience</p>
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
               <UserPosts />
            </div>
          </div>
        </div>
      )}

      {showPopup && popupArticle && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-4 border-white flex flex-col relative group">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[10px]">
                  <Award size={14} />
                  <span>Topic: {popupArticle.category}</span>
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
                        alt={`Supporting Image ${idx + 1}`}
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
                onClick={() => handleReviewLater(popupArticle)}
                className="bg-slate-900 text-white px-12 py-4 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-600 shadow-2xl transition-all active:scale-95"
              >
                Review Later
              </button>
            </div>
          </div>
        </div>
      )}

      {showCommentsModal && selectedPost && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in" 
            onClick={() => setShowCommentsModal(false)} 
          />
          <div className="relative w-full md:w-[750px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <header className="p-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-lg">
                    {selectedPost.authorName?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">{selectedPost.animalName}</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mt-0.5">
                       {selectedPost.authorName}
                    </p>
                  </div>
              </div>
              <button onClick={() => setShowCommentsModal(false)} className="p-3 text-slate-400 hover:text-rose-500 transition-all active:scale-95">
                <X size={24} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg w-fit flex items-center gap-2">
                       <BookOpen size={12} /> Narrative
                    </span>
                    <p className="text-lg text-slate-700 font-medium leading-relaxed italic break-all">"{selectedPost.experience}"</p>
                  </div>
                  
                  {selectedPost.photoUrl && (
                    <div className="rounded-3xl overflow-hidden border-2 border-slate-50 shadow-inner">
                       <img src={`${IMAGE_BASE_URL}${selectedPost.photoUrl}`} alt="Observation Detail" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  <div className="flex gap-8 border-y border-slate-50 py-6">
                    <div className="space-y-0.5">
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Likes</span>
                       <p className="text-xl font-black text-slate-900">{selectedPost.likes || 0}</p>
                    </div>
                    <div className="space-y-0.5">
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Comments</span>
                       <p className="text-xl font-black text-slate-900">{selectedPost.comments?.length || 0}</p>
                    </div>
                  </div>

                  <div className="space-y-8 pb-10">
                    <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                      <MessageSquare size={16} className="text-emerald-500" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-bold">Expert Consensus</h4>
                    </div>

                    <div className="space-y-6">
                      {(selectedPost.comments || []).map((comment) => (
                        <NestedComment 
                          key={comment._id} 
                          comment={comment} 
                          postId={selectedPost._id} 
                          depth={0} 
                          maxDepth={4} 
                          activeUser={activeUser} 
                          onReply={handleReply} 
                          onUpdate={handleUpdateComment} 
                          onDelete={handleDeleteComment} 
                          postAuthorId={selectedPost.authorId}
                        />
                      ))}
                      {(!selectedPost.comments || selectedPost.comments.length === 0) && (
                        <div className="py-12 text-center space-y-3">
                           <MessageSquare size={32} className="mx-auto text-slate-100" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Analysis Pending</p>
                        </div>
                      )}
                    </div>
                  </div>
               </div>
            </div>

            {activeUser && (
              <div className="p-6 bg-white border-t border-slate-50 sticky bottom-0">
                <div className="flex gap-3 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  <input
                    type="text"
                    placeholder="Add professional insight..."
                    value={commentTexts[selectedPost._id] || ''}
                    onChange={(e) => setCommentTexts(prev => ({ ...prev, [selectedPost._id]: e.target.value }))}
                    className="flex-1 bg-transparent px-5 py-3 focus:outline-none font-bold text-slate-800 text-xs"
                  />
                  <button onClick={() => handleCommentSubmit(selectedPost._id)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md active:scale-95">Post</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityFeed;
