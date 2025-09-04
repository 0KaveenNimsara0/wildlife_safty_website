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
  Shield,
  Loader2
} from 'lucide-react';
import ChatInterface from '../../components/ChatInterface';  // Added missing import

// User Chat Interface Component
const UserChatInterface = ({
  conversations,
  currentConversation,
  messages,
  onConversationSelect,
  onSendMessage,
  loading,
  error
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() && currentConversation) {
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-900">Chat with Users</h3>
      </div>

      <div className="flex-1 flex">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700">Conversations</h4>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => onConversationSelect(conversation)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 transition ${
                    currentConversation?._id === conversation._id
                      ? 'bg-blue-50 border-r-4 border-blue-500'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {conversation.user?.displayName || conversation.user?.email || 'User'}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {conversation.lastMessage?.message || 'No messages yet'}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {conversations.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No conversations yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {currentConversation.user?.displayName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {currentConversation.user?.displayName || currentConversation.user?.email || 'User'}
                    </h4>
                    <p className="text-xs text-gray-500">User Inquiry</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const isMedicalOfficer = message.senderType === 'medical_officer';
                      const showDate = index === 0 || formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);

                      return (
                        <div key={message._id}>
                          {showDate && (
                            <div className="text-center my-4">
                              <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          )}

                          <div className={`flex ${isMedicalOfficer ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isMedicalOfficer
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}>
                              <p className="text-sm">{message.message}</p>
                              <p className={`text-xs mt-1 ${isMedicalOfficer ? 'text-blue-100' : 'text-gray-500'}`}>
                                {formatTime(message.createdAt)}
                                {message.isRead && isMedicalOfficer && (
                                  <span className="ml-2">✓✓</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your medical advice here..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Conversation</h3>
                <p className="text-gray-500 text-sm">
                  Choose a user from the list to view and respond to their messages.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function for date formatting
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
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
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
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

      // Fetch conversations
      await fetchConversations();

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch('http://localhost:5000/api/medical-officer/chat/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleConversationSelect = async (conversation) => {
    setCurrentConversation(conversation);
    setChatLoading(true);

    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`http://localhost:5000/api/medical-officer/chat/messages/${conversation._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessageToUser = async (message) => {
    if (!currentConversation || !currentConversation.user?.uid) return;

    try {
      setChatLoading(true);
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`http://localhost:5000/api/medical-officer/chat/send/${currentConversation.user.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      if (response.ok) {
        const data = await response.json();
        // Add the new message to the messages list
        setMessages(prev => [...prev, data.message]);
        // Refresh conversations to update last message
        await fetchConversations();
      } else {
        setError('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message to user:', error);
      setError('Failed to send message');
    } finally {
      setChatLoading(false);
    }
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
            <UserChatInterface
              conversations={conversations}
              currentConversation={currentConversation}
              messages={messages}
              onConversationSelect={handleConversationSelect}
              onSendMessage={handleSendMessageToUser}
              loading={chatLoading}
              error={error}
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
            medicalOfficer={medicalOfficerData}
            placeholder="Type your message to admin..."
          />
          </div>
        </div>
      </main>
    </div>
  );
}
