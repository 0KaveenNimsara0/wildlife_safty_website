import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  FileText,
  LogOut,
  Stethoscope,
  AlertCircle,
  Send,
  Edit2,
  Loader2,
  Paperclip, // Added for potential attachments
} from 'lucide-react';
import ChatInterface from '../../components/ChatInterface'; // Assuming this component exists

// --- Helper Functions (for better code organization) ---

/**
 * Formats a date string into "Today", "Yesterday", or a localized date string.
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString();
};

/**
 * Formats a date string into a localized time string (e.g., "10:30 AM").
 */
const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// --- Re-designed Child Components ---

// User Chat Interface Component
const UserChatInterface = ({
  conversations,
  currentConversation,
  messages,
  onConversationSelect,
  onSendMessage,
  loading,
  error,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Effect to scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const UserAvatar = ({ user }) => (
    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
      <span className="text-white font-bold text-sm">
        {user?.displayName?.charAt(0).toUpperCase() ||
          user?.email?.charAt(0).toUpperCase() ||
          'U'}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col h-[75vh]">
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Inbox</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => onConversationSelect(conv)}
                  className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${
                    currentConversation?._id === conv._id
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <UserAvatar user={conv.user} />
                  <div className="flex-1 ml-3 overflow-hidden">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {conv.user?.displayName || conv.user?.email || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {conv.lastMessage?.message || 'No messages yet'}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400 mt-10">
                <MessageSquare className="h-10 w-10 mx-auto mb-2" />
                <p className="text-sm">No conversations found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50/50">
                <UserAvatar user={currentConversation.user} />
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">
                    {currentConversation.user?.displayName ||
                      currentConversation.user?.email ||
                      'User'}
                  </h4>
                  <p className="text-xs text-green-600">Online</p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((message) => {
                      const isMedicalOfficer = message.senderType === 'medical_officer';
                      return (
                        <div
                          key={message._id}
                          className={`flex items-end gap-2 ${
                            isMedicalOfficer ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-md px-4 py-3 rounded-2xl ${
                              isMedicalOfficer
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p
                              className={`text-xs mt-1 text-right ${
                                isMedicalOfficer ? 'text-blue-100' : 'text-gray-400'
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your medical advice here..."
                    className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-400">
                <MessageSquare className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700">
                  Select a Conversation
                </h3>
                <p className="text-sm">
                  Choose a user from the list to start chatting.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Article Management Component
const ArticleManagement = ({ articles, onCreateArticle, onEditArticle }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Article Management
        </h3>
        <button
          onClick={onCreateArticle}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex items-center gap-2 text-sm font-medium"
        >
          <FileText className="h-4 w-4" />
          Create New
        </button>
      </div>

      <div className="space-y-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div
              key={article._id}
              className="border border-gray-100 rounded-lg p-4 transition hover:shadow-sm hover:border-blue-200"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {article.excerpt || 'No excerpt available.'}
                  </p>
                  <div className="flex items-center mt-3 space-x-3">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {article.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onEditArticle(article)}
                  className="p-2 text-gray-400 hover:text-blue-500 transition"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-10 border-2 border-dashed border-gray-200 rounded-lg">
            <FileText className="h-10 w-10 mx-auto mb-2" />
            <p className="font-medium">No Articles Found</p>
            <p className="text-sm">
              Click "Create New" to write your first article.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---

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
    setLoading(true);
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const articlesResponse = await fetch(
        'http://localhost:5000/api/medical-officer/articles/my-articles',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        setArticles(articlesData.articles);
      }
      await fetchConversations();
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(
        'http://localhost:5000/api/medical-officer/chat/conversations',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const handleConversationSelect = async (conversation) => {
    if (currentConversation?._id === conversation._id) return;
    setCurrentConversation(conversation);
    setChatLoading(true);
    setError('');
    setMessages([]);
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(
        `http://localhost:5000/api/medical-officer/chat/messages/${conversation._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessageToUser = async (message) => {
    if (!currentConversation || !currentConversation.user?.uid) return;
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(
        `http://localhost:5000/api/medical-officer/chat/send/${currentConversation.user.uid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.message]);
        await fetchConversations(); // Refresh conversations to update last message
      } else {
        setError('Failed to send message.');
      }
    } catch (err) {
      console.error('Error sending message to user:', err);
      setError('Failed to send message.');
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


  const handleCreateArticle = () => navigate('/medical-officer/articles/create');
  const handleEditArticle = (article) => navigate(`/medical-officer/articles/edit/${article._id}`);
  
  const handleLogout = () => {
    localStorage.removeItem('medicalOfficerToken');
    localStorage.removeItem('medicalOfficerData');
    navigate('/medical-officer/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100/50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Medical Officer Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome, {medicalOfficerData?.name || 'Doctor'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex items-center bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
            <AlertCircle className="w-5 h-5 mr-3" />
            <span>{error}</span>
          </div>
        )}

        {/* Updated Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (Wider) - Chat with Users */}
          <div className="lg:col-span-2">
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

          {/* Right Column - Other Widgets */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <ArticleManagement
              articles={articles}
              onCreateArticle={handleCreateArticle}
              onEditArticle={handleEditArticle}
            />
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