import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/token/', { email, password });
  return response.data;
};

export const getMaintenanceRequests = async () => {
  const response = await api.get('/maintenance-requests/');
  return response.data;
};

export const createMaintenanceRequest = async (data: any) => {
  const response = await api.post('/maintenance-requests/', data);
  return response.data;
};

export const getAmenities = async () => {
  const response = await api.get('/amenities/');
  return response.data;
};

export const createAmenityBooking = async (data: any) => {
  const response = await api.post('/amenity-bookings/', data);
  return response.data;
};

export const getPayments = async () => {
  const response = await api.get('/payments/');
  return response.data;
};

export default api;