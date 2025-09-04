import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import MedicalOfficerSelector from '../components/MedicalOfficerSelector';
import ChatInterface from '../components/ChatInterface';

const API_BASE_URL = 'http://localhost:5000/api';

const UserChatPage = () => {
  const { currentUser } = useAuth();
  const [selectedMedicalOfficer, setSelectedMedicalOfficer] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getIdToken = async () => {
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  };

  const fetchConversations = async () => {
    try {
      const token = await getIdToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/user/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations.');
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const token = await getIdToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/user/chat/messages/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message) => {
    try {
      const token = await getIdToken();
      if (!token || !selectedMedicalOfficer) return;

      const response = await fetch(`${API_BASE_URL}/user/chat/send/${selectedMedicalOfficer._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        fetchConversations();
      } else {
        setError(data.message || 'Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message.');
    }
  };

  const handleMedicalOfficerSelect = (medicalOfficer) => {
    setSelectedMedicalOfficer(medicalOfficer);
    setCurrentConversation(null);
    setMessages([]);
  };

  const handleConversationSelect = (conversation) => {
    setCurrentConversation(conversation);
    setSelectedMedicalOfficer(conversation.medicalOfficer);
    fetchMessages(conversation._id);
  };

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-extrabold text-green-700 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to use the chat feature and connect with our medical professionals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <header className="bg-green-700 px-6 py-6 text-white text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Medical Officer Chat</h1>
            <p className="text-green-200 mt-1">Connect with medical professionals for expert advice on wildlife safety and care.</p>
          </header>

          <div className="flex flex-col sm:flex-row h-[70vh]">
            <aside className="w-full sm:w-1/3 border-b sm:border-r border-gray-200 flex flex-col bg-gray-50">
              <MedicalOfficerSelector
                onSelect={handleMedicalOfficerSelect}
                selectedMedicalOfficer={selectedMedicalOfficer}
              />

              <div className="flex-1 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 bg-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Your Conversations</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {conversations.length > 0 ? (
                    conversations.map((conversation) => (
                      <div
                        key={conversation._id}
                        onClick={() => handleConversationSelect(conversation)}
                        className={`p-4 cursor-pointer transition-all duration-200 hover:bg-green-50 ${
                          currentConversation?._id === conversation._id ? 'bg-green-100 border-l-4 border-green-600' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {conversation.medicalOfficer?.name || 'Medical Officer'}
                            </p>
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {conversation.lastMessage?.message || 'Start a new conversation.'}
                            </p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-green-600 text-white text-xs font-bold rounded-full px-2 py-1 ml-3 flex-shrink-0">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No conversations found. Select a medical officer to begin.
                    </div>
                  )}
                </div>
              </div>
            </aside>

            <main className="flex-1 flex flex-col">
              {selectedMedicalOfficer ? (
                <ChatInterface
                  medicalOfficer={selectedMedicalOfficer}
                  messages={messages}
                  onSendMessage={sendMessage}
                  loading={loading}
                  error={error}
                  onClearError={() => setError(null)}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                  <div className="text-7xl text-green-300 mb-4 animate-bounce">💬</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to the Chat</h3>
                  <p className="text-gray-500 max-w-sm">
                    Choose a medical officer from the list on the left or select an existing conversation to continue your chat.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;