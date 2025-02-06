import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Announcement endpoints with error handling
export const getAnnouncements = async () => {
  try {
    const response = await api.get('/announcements/');
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

export const createAnnouncement = async (data: any) => {
  try {
    const response = await api.post('/announcements/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

// User endpoints
export const getUsers = async () => {
  try {
    const response = await api.get('/users/');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Vehicle endpoints
export const getVehicles = async () => {
  try {
    const response = await api.get('/vehicles/');
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

// Maintenance request endpoints with error handling
export const getMaintenanceRequests = async () => {
  try {
    const response = await api.get('/maintenance-requests/');
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    throw error;
  }
};

export const createMaintenanceRequest = async (data: any) => {
  try {
    const response = await api.post('/maintenance-requests/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    throw error;
  }
};

export const updateMaintenanceRequest = async (id: number, data: any) => {
  try {
    const response = await api.put(`/maintenance-requests/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    throw error;
  }
};

export const updateMaintenanceStatus = async (id: number, status: string) => {
  try {
    const response = await api.post(`/maintenance-requests/${id}/update_status/`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    throw error;
  }
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

// Payment endpoints
export const getPayments = async () => {
  const response = await api.get('/payments/');
  return response.data;
};

export const createPayment = async (data: any) => {
  const response = await api.post('/payments/', data);
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
