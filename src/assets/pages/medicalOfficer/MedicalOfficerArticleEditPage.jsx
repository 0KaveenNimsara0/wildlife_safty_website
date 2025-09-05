import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MedicalOfficerArticleEditPage = () => {
  const { articleId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      setLoadingArticle(true);
      try {
        const token = localStorage.getItem('medicalOfficerToken');
        const response = await fetch(`http://localhost:5000/api/medical-officer/articles/${articleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setTitle(data.article.title || '');
          setContent(data.article.content || '');
          setExcerpt(data.article.excerpt || '');
          setCategory(data.article.category || '');
          setTags((data.article.tags || []).join(', '));
          setImages((data.article.images || []).join(', '));
        } else {
          setError(data.message || 'Failed to load article');
        }
      } catch (err) {
        setError('Server error');
      } finally {
        setLoadingArticle(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim() || !category.trim()) {
      setError('Title, content, and category are required.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`http://localhost:5000/api/medical-officer/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          category,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          images: images.split(',').map(img => img.trim()).filter(img => img)
        })
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/medical-officer/dashboard');
      } else {
        setError(data.message || 'Failed to update article');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Edit Article</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Content *</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Category *</label>
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Images URLs (comma separated)</label>
          <input
            type="text"
            value={images}
            onChange={e => setImages(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalOfficerArticleEditPage;
