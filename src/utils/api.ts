import axios from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "@/utils/auth";

export type Role = "admin" | "manager" | "resident";

export interface MeResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  resident: {
    id: number;
    unit_number: string;
    phone_number: string;
    move_in_date: string;
  } | null;
  staff: {
    id: number;
    title?: string | null;
  } | null;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}

const api = axios.create({
  baseURL: "/api",
});

const refreshClient = axios.create({
  baseURL: "/api",
});

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await refreshClient.post("/token/refresh/", {
      refresh: refreshToken,
    });
    setAccessToken(response.data.access);
    return response.data.access as string;
  } catch (error) {
    clearTokens();
    return null;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);


// Auth endpoints
export const login = async (email: string, password: string) => {
  const response = await api.post<LoginResponse>("/token/", { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get<MeResponse>("/me");
  return response.data;
};

export const getHealth = async () => {
  const response = await api.get("/health");
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

export const createMaintenanceRequest = async (data: {
  title: string;
  description: string;
  status: string;
  priority: string;
}) => {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  try {
    const response = await api.post("/maintenance-requests/", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.detail || "Something went wrong.");
    } else {
      console.error("Request Error:", error.message);
      throw new Error("Failed to connect to the server.");
    }
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


// Package endpoints
export const getPackages = async () => {
  const response = await api.get('/packages/');
  return response.data;
};

export const createPackage = async (data: any) => {
  const response = await api.post('/packages/', data);
  return response.data;
};

export const updatePackageStatus = async (id: number, status: string) => {
  const response = await api.patch(`/packages/${id}/`, { status });
  return response.data;
};

// Poll endpoints
export const getPolls = async () => {
  const response = await api.get('/polls/');
  return response.data;
};

export const createPoll = async (data: any) => {
  const response = await api.post('/polls/', data);
  return response.data;
};

export const votePoll = async (pollId: number, optionId: number) => {
  const response = await api.post(`/polls/${pollId}/vote/`, { option_id: optionId });
  return response.data;
};

// Incident Report endpoints
export const getIncidentReports = async () => {
    const response = await api.get('/incidents/');
    return response.data;
};

export const createIncidentReport = async (data: any) => {
    // Check if data is FormData (for image upload)
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.post('/incidents/', data, config);
    return response.data;
};

export const updateIncidentReport = async (id: number, data: any) => {
    const response = await api.patch(`/incidents/${id}/`, data);
    return response.data;
};

// Event endpoints
export const getEvents = async () => {
    const response = await api.get('/events/');
    return response.data;
};

export const createEvent = async (data: any) => {
    const response = await api.post('/events/', data);
    return response.data;
};
