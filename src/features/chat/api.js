import api from '../../services/api';

export const fetchChatHistory = async (officerId) => {
  const response = await api.get(`/chat/${officerId}`);
  return response.data;
};

export const sendMessage = async (officerId, messageData) => {
  const response = await api.post(`/chat/${officerId}`, messageData);
  return response.data;
};

export const fetchConsultations = async () => {
  const response = await api.get('/medical-officer/consultations');
  return response.data;
};
