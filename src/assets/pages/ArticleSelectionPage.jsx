import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const fixedCategories = [
  'wildlife_safety',
  'medical_advice',
  'emergency_response',
  'prevention',
  'treatment'
];

const ArticleSelectionPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(fixedCategories[0]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [popupArticle, setPopupArticle] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchArticles(selectedCategory);
  }, [selectedCategory]);

  const fetchArticles = async (category) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/articles/category/${category}`);
      setArticles(response.data.articles || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch articles');
      console.error(err);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Article Selection</h1>
      <div className="mb-4">
        <label htmlFor="category-select" className="block mb-2 font-medium text-gray-700">
          Select Category
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full"
        >
          {fixedCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading articles...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-3">
        {articles.map((article) => (
          <li
            key={article._id}
            className="p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-green-50"
            onClick={() => openArticlePopup(article)}
          >
            <h2 className="font-semibold text-lg">{article.title}</h2>
            <p className="text-sm text-gray-600 truncate">{article.excerpt}</p>
          </li>
        ))}
      </ul>

      {showPopup && popupArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              onClick={closeArticlePopup}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Close article popup"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{popupArticle.title}</h2>
            <div className="prose max-w-none whitespace-pre-wrap">
              {popupArticle.content}
            </div>
            {popupArticle.images && popupArticle.images.length > 0 && (
              <div className="mt-4 space-y-2">
                {popupArticle.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`Article image ${idx + 1}`}
                    className="w-full rounded-md"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleSelectionPage;
