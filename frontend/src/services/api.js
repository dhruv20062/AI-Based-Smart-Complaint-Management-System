import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Complaint APIs
export const addComplaint = (data) => API.post('/complaints', data);
export const getAllComplaints = (params) => API.get('/complaints', { params });
export const getComplaintById = (id) => API.get(`/complaints/${id}`);
export const updateComplaintStatus = (id, data) => API.put(`/complaints/${id}`, data);
export const deleteComplaint = (id) => API.delete(`/complaints/${id}`);
export const searchByLocation = (location) => API.get(`/complaints/search?location=${location}`);

// AI APIs
export const analyzeComplaint = (complaintId) => API.post('/ai/analyze', { complaintId });
export const analyzeAllComplaints = () => API.post('/ai/analyze-all');

export default API;
