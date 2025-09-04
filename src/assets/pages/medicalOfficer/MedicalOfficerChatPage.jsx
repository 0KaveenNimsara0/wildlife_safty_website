import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const MedicalOfficerChatPage = () => {
  const [medicalOfficerId, setMedicalOfficerId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Get medical officer ID from localStorage (assuming it's stored after login)
  useEffect(() => {
    const token = localStorage.getItem('medicalOfficerToken');
    if (token) {
      setMedicalOfficerId(token);
    } else {
      setError('Medical officer not logged in');
    }
  }, []);

  useEffect(() => {
    let messagesInterval = null;
    let conversationsInterval = null;

    if (medicalOfficerId && currentConversation) {
      fetchConversations(medicalOfficerId);

      // Poll conversations every 5 seconds
      conversationsInterval = setInterval(() => {
        fetchConversations(medicalOfficerId);
      }, 5000);

      // Poll messages for current conversation every 3 seconds
      messagesInterval = setInterval(() => {
        fetchMessages(currentConversation._id);
      }, 3000);
    }

    return () => {
      if (messagesInterval) clearInterval(messagesInterval);
      if (conversationsInterval) clearInterval(conversationsInterval);
    };
  }, [medicalOfficerId, currentConversation]);

  // Fetch conversations
  const fetchConversations = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${id}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      } else {
        setError(data.message || 'Failed to load conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/messages/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${medicalOfficerId}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        setError(data.message || 'Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation) return;

    try {
      const userId = currentConversation.user?.uid;
      if (!userId) return;

      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/send/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${medicalOfficerId}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage.trim() }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');
        fetchConversations(medicalOfficerId);
      } else {
        setError(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  // Select conversation
  const handleConversationSelect = (conversation) => {
    setCurrentConversation(conversation);
    fetchMessages(conversation._id);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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

  if (!medicalOfficerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-2">Please Login</h2>
          <p className="text-gray-600">You need to be logged in as a medical officer to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
          <div className="px-6 py-4 bg-green-600 text-white">
            <h1 className="text-2xl font-bold">Medical Officer Chat</h1>
            <p className="text-green-100">Respond to user inquiries and provide medical guidance</p>
          </div>

          <div className="flex h-[32rem]">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-green-100 flex flex-col bg-green-50/30">
              <div className="p-4 border-b border-green-100 bg-green-100/30">
                <h3 className="text-lg font-semibold text-green-800">Active Conversations</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-green-100">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => handleConversationSelect(conversation)}
                      className={`p-4 cursor-pointer hover:bg-green-100/50 transition ${
                        currentConversation?._id === conversation._id
                          ? 'bg-green-100 border-r-4 border-green-500'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-green-900">
                            {conversation.user?.displayName || conversation.user?.email || 'User'}
                          </p>
                          <p className="text-sm text-green-700 truncate">
                            {conversation.lastMessage?.message || 'No messages yet'}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {conversations.length === 0 && (
                    <div className="p-4 text-center text-green-600">
                      No conversations yet. Users will appear here when they send messages.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="flex-1 flex flex-col bg-white">
              {currentConversation ? (
                loading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                  </div>
                ) : (
                  <>
                    {/* Chat Header */}
                    <div className="px-6 py-4 bg-white border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {currentConversation.user?.displayName?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {currentConversation.user?.displayName || currentConversation.user?.email || 'User'}
                          </h3>
                          <p className="text-sm text-gray-500">User Inquiry</p>
                        </div>
                        <div className="ml-auto">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Online</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                          <div className="ml-auto pl-3">
                            <button
                              onClick={() => setError(null)}
                              className="inline-flex rounded-md p-1.5 text-red-400 hover:bg-red-100 hover:text-red-600"
                            >
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[500px]">
                      {messages.length === 0 && (
                        <div className="text-center py-12">
                          <div className="text-6xl text-gray-300 mb-4">💬</div>
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Messages Yet</h3>
                          <p className="text-gray-500">Start the conversation by sending a message to the user.</p>
                        </div>
                      )}

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
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-200 text-gray-900'
                              }`}>
                                <p className="text-sm">{message.message}</p>
                                <p className={`text-xs mt-1 ${isMedicalOfficer ? 'text-green-100' : 'text-gray-500'}`}>
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

                    {/* Message Input */}
                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                      <form onSubmit={sendMessage} className="flex space-x-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your medical advice here..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            disabled={loading}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!newMessage.trim() || loading}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            'Send'
                          )}
                        </button>
                      </form>
                    </div>
                  </>
                )
              ) : (
                <div className="flex-1 flex items-center justify-center bg-green-50/40">
                  <div className="text-center">
                    <div className="text-6xl text-green-300 mb-4">👨‍⚕️</div>
                    <h3 className="text-xl font-semibold text-green-700 mb-2">Select a Conversation</h3>
                    <p className="text-green-600">
                      Choose a user from the list to view and respond to their messages.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalOfficerChatPage;
