import api from '../../services/api';

export const fetchPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const fetchArticles = async () => {
  const response = await api.get('/articles');
  return response.data;
};

export const fetchArticleById = async (id) => {
  const response = await api.get(`/articles/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};
