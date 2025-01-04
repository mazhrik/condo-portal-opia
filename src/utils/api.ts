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

// Auth endpoints
export const login = async (email: string, password: string) => {
  const response = await api.post('/token/', { email, password });
  return response.data;
};

// Announcement endpoints
export const getAnnouncements = async () => {
  const response = await api.get('/announcements/');
  return response.data;
};

export const createAnnouncement = async (data: any) => {
  const response = await api.post('/announcements/', data);
  return response.data;
};

// Maintenance request endpoints
export const getMaintenanceRequests = async () => {
  const response = await api.get('/maintenance-requests/');
  return response.data;
};

export const createMaintenanceRequest = async (data: any) => {
  const response = await api.post('/maintenance-requests/', data);
  return response.data;
};

export const updateMaintenanceRequest = async (id: number, data: any) => {
  const response = await api.put(`/maintenance-requests/${id}/`, data);
  return response.data;
};

// Amenity endpoints
export const getAmenities = async () => {
  const response = await api.get('/amenities/');
  return response.data;
};

export const updateAmenityBooking = async (id: number, data: any) => {
  const response = await api.put(`/amenities/${id}/`, data);
  return response.data;
};

// Resident endpoints
export const getResidents = async () => {
  const response = await api.get('/residents/');
  return response.data;
};

export const getResidentProfile = async (id: number) => {
  const response = await api.get(`/residents/${id}/`);
  return response.data;
};

export const createResident = async (data: any) => {
  const response = await api.post('/residents/', data);
  return response.data;
};

export const updateResident = async (id: number, data: any) => {
  const response = await api.put(`/residents/${id}/`, data);
  return response.data;
};

// Maintenance request endpoints
export const getMaintenanceRequests = async () => {
  const response = await api.get('/maintenance-requests/');
  return response.data;
};

export const createMaintenanceRequest = async (data: any) => {
  const response = await api.post('/maintenance-requests/', data);
  return response.data;
};

export const updateMaintenanceRequest = async (id: number, data: any) => {
  const response = await api.put(`/maintenance-requests/${id}/`, data);
  return response.data;
};

// Payment endpoints
export const getPayments = async () => {
  const response = await api.get('/payments/');
  return response.data;
};

export const createPayment = async (data: any) => {
  const response = await api.post('/payments/', data);
  return response.data;
};

// Amenity endpoints
export const getAmenities = async () => {
  const response = await api.get('/amenities/');
  return response.data;
};

export const getAmenityDetails = async (id: number) => {
  const response = await api.get(`/amenities/${id}/`);
  return response.data;
};

// Amenity booking endpoints
export const getAmenityBookings = async () => {
  const response = await api.get('/amenity-bookings/');
  return response.data;
};

export const createAmenityBooking = async (data: any) => {
  const response = await api.post('/amenity-bookings/', data);
  return response.data;
};

export const updateAmenityBooking = async (id: number, data: any) => {
  const response = await api.put(`/amenity-bookings/${id}/`, data);
  return response.data;
};

// Staff endpoints
export const getStaffMembers = async () => {
  const response = await api.get('/staff/');
  return response.data;
};

export const getStaffMember = async (id: number) => {
  const response = await api.get(`/staff/${id}/`);
  return response.data;
};

// Document endpoints
export const getDocuments = async () => {
  const response = await api.get('/documents/');
  return response.data;
};

export const uploadDocument = async (data: FormData) => {
  const response = await api.post('/documents/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Parking endpoints
export const getParkingSpots = async () => {
  const response = await api.get('/parking-spots/');
  return response.data;
};

export const getVisitorPasses = async () => {
  const response = await api.get('/visitor-parking/');
  return response.data;
};

export const requestVisitorPass = async (data: any) => {
  const response = await api.post('/visitor-parking/', data);
  return response.data;
};

export default api;
