import axios from 'axios';

const API_URL = 'https://doubtbuddy-be.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and user data if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if needed
      window.location.href = '/login';
    }
    // Transform error message for better UI display
    const errorMessage = error.response?.data?.msg || error.response?.data?.error || error.message;
    error.displayMessage = errorMessage;
    return Promise.reject(error);
  }
);

// Auth services
export const register = (userData) => api.post('/api/auth/register', userData);
export const login = (credentials) => api.post('/api/auth/login', credentials);

// Question services
export const createQuestion = (questionData) => api.post('/api/questions', questionData);
export const getMyQuestions = () => api.get('/api/questions/my-questions');
export const getAssignedQuestions = () => api.get('/api/questions/assigned');
export const getAvailableDoubts = () => api.get('/api/questions/available');
export const assignTutor = (questionId) => api.post(`/api/questions/${questionId}/assign`);
export const updateQuestionStatus = (questionId, status, data) => 
  api.put(`/api/questions/${questionId}/status`, { status, ...data });
export const reopenDoubt = (questionId, reason) => 
  api.put(`/api/questions/${questionId}/reopen`, { reason });
export const rateDoubt = (questionId, score, feedback) => 
  api.put(`/api/questions/${questionId}/rate`, { score, feedback });

// Comment services
export const getComments = (questionId) => api.get(`/api/questions/${questionId}/comments`);
export const addComment = (questionId, text) => api.post(`/api/questions/${questionId}/comments`, { text });

export default api;
