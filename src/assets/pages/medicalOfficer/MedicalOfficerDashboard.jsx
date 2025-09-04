import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  FileText,
  LogOut,
  Stethoscope,
  AlertCircle,
  Send,
  User,
  Shield
} from 'lucide-react';

// Chat Interface Component
const ChatInterface = ({ title, messages, onSendMessage, currentUser, placeholder }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === currentUser.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === currentUser.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Article Management Component
const ArticleManagement = ({ articles, onCreateArticle, onEditArticle }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Article Management</h3>
        <button
          onClick={onCreateArticle}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <FileText className="h-4 w-4 mr-2 inline" />
          Create Article
        </button>
      </div>

      <div className="space-y-4">
        {articles.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No articles yet</p>
            <p className="text-sm">Create your first article for the community</p>
          </div>
        ) : (
          articles.map((article) => (
            <div key={article._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-md font-medium text-gray-900">{article.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{article.excerpt || 'No excerpt'}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      article.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      article.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                      article.status === 'approved' ? 'bg-green-100 text-green-800' :
                      article.status === 'published' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {article.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onEditArticle(article)}
                  className="ml-4 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function MedicalOfficerDashboard() {
  const [medicalOfficerData, setMedicalOfficerData] = useState(null);
  const [userMessages, setUserMessages] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('medicalOfficerToken');
    const medicalOfficer = localStorage.getItem('medicalOfficerData');

    if (!token || !medicalOfficer) {
      navigate('/medical-officer/login');
      return;
    }

    setMedicalOfficerData(JSON.parse(medicalOfficer));
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('medicalOfficerToken');

      // Fetch articles
      const articlesResponse = await fetch('http://localhost:5000/api/medical-officer/articles/my-articles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        setArticles(articlesData.articles);
      }

      // Fetch conversations (this would be implemented with real-time updates)
      // For now, we'll show empty states

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessageToUser = async (message) => {
    // Implementation for sending message to user
    console.log('Sending message to user:', message);
    // This would integrate with the chat API
  };

  const handleSendMessageToAdmin = async (message) => {
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch('http://localhost:5000/api/medical-officer/chat/send/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      if (response.ok) {
        const data = await response.json();
        setAdminMessages(prev => [...prev, data.message]);
      }
    } catch (error) {
      console.error('Error sending message to admin:', error);
    }
  };

  const handleCreateArticle = () => {
    navigate('/medical-officer/articles/create');
  };

  const handleEditArticle = (article) => {
    navigate(`/medical-officer/articles/edit/${article._id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('medicalOfficerToken');
    localStorage.removeItem('medicalOfficerData');
    navigate('/medical-officer/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Medical Officer Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {medicalOfficerData?.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chat with Users */}
          <div className="lg:col-span-1">
            <ChatInterface
              title="Chat with Users"
              messages={userMessages}
              onSendMessage={handleSendMessageToUser}
              currentUser={medicalOfficerData}
              placeholder="Type your message to user..."
            />
          </div>

          {/* Middle Column - Article Management */}
          <div className="lg:col-span-1">
            <ArticleManagement
              articles={articles}
              onCreateArticle={handleCreateArticle}
              onEditArticle={handleEditArticle}
            />
          </div>

          {/* Right Column - Chat with Admin */}
          <div className="lg:col-span-1">
            <ChatInterface
              title="Chat with Admin"
              messages={adminMessages}
              onSendMessage={handleSendMessageToAdmin}
              currentUser={medicalOfficerData}
              placeholder="Type your message to admin..."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
