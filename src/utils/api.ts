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
    is_board_member: boolean;
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

export interface Announcement {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Announcement[];
}

export interface DashboardSummary {
  announcements: {
    active_count: number;
    latest: Array<{
      id: number;
      title: string;
      created_at: string;
    }>;
  };
}

export type MaintenanceStatus =
  | "new"
  | "in_review"
  | "assigned"
  | "in_progress"
  | "completed"
  | "closed";

export type MaintenancePriority = "low" | "medium" | "high";

export interface MaintenanceRequest {
  id: number;
  resident: number;
  title: string;
  description: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  assigned_to: number | null;
  completion_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MaintenanceRequest[];
}

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api";

const api = axios.create({
  baseURL,
});

const refreshClient = axios.create();

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

export const googleLogin = async (accessToken: string) => {
  const response = await api.post<LoginResponse>("/auth/google/", {
    access_token: accessToken,
  });
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

export const getDashboardSummary = async () => {
  const response = await api.get<DashboardSummary>("/dashboard/summary");
  return response.data;
};

// Announcement endpoints
export const getAnnouncements = async (params?: { is_active?: boolean }) => {
  const response = await api.get<AnnouncementListResponse>("/announcements/", {
    params,
  });
  return response.data;
};

export const getAnnouncement = async (id: number | string) => {
  const response = await api.get<Announcement>(`/announcements/${id}/`);
  return response.data;
};

export const createAnnouncement = async (data: {
  title: string;
  content: string;
  is_active?: boolean;
}) => {
  const response = await api.post<Announcement>("/announcements/", data);
  return response.data;
};

export const updateAnnouncement = async (
  id: number | string,
  data: Partial<Pick<Announcement, "title" | "content" | "is_active">>
) => {
  const response = await api.patch<Announcement>(`/announcements/${id}/`, data);
  return response.data;
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

export const getMaintenanceRequests = async (params?: {
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  assigned_to?: number;
  resident_id?: number;
  created_from?: string;
  created_to?: string;
  q?: string;
}) => {
  const response = await api.get<MaintenanceListResponse>("/maintenance-requests/", {
    params,
  });
  return response.data;
};

export const getMaintenanceRequest = async (id: number | string) => {
  const response = await api.get<MaintenanceRequest>(`/maintenance-requests/${id}/`);
  return response.data;
};

export const createMaintenanceRequest = async (data: {
  title: string;
  description: string;
  priority: MaintenancePriority;
}) => {
  const response = await api.post<MaintenanceRequest>("/maintenance-requests/", data);
  return response.data;
};

export const updateMaintenanceRequest = async (
  id: number | string,
  data: Partial<Pick<MaintenanceRequest, "status" | "assigned_to" | "completion_notes">>
) => {
  const response = await api.patch<MaintenanceRequest>(
    `/maintenance-requests/${id}/`,
    data
  );
  return response.data;
};

export const updateMaintenanceStatus = async (
    id: number | string,
    status: MaintenanceStatus
  ) => {
    const response = await api.patch<MaintenanceRequest>(
      `/maintenance-requests/${id}/`,
      { status }
    );
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

export const createPaymentIntent = async (amount: number) => {
  const response = await api.post('/payments/create-intent/', { amount });
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

// Notification endpoints
export const getNotifications = async (params?: { unread?: boolean }) => {
  const response = await api.get('/notifications/', { params });
  return response.data;
};

export const markNotificationAsRead = async (id: number) => {
  const response = await api.post(`/notifications/${id}/mark_read/`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.post('/notifications/mark_all_read/');
  return response.data;
};

// Architectural Request endpoints
export const getArchitecturalRequests = async (params?: { status?: string }) => {
  const response = await api.get('/architectural-requests/', { params });
  return response.data;
};

export const createArchitecturalRequest = async (data: FormData) => {
  const response = await api.post('/architectural-requests/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateArchitecturalRequestStatus = async (id: number, status: string, comment?: string) => {
  const response = await api.patch(`/architectural-requests/${id}/status/`, { status, comment });
  return response.data;
};

// Violation endpoints
export const getViolations = async (params?: { resident_id?: number, status?: string }) => {
  const response = await api.get('/violations/', { params });
  return response.data;
};

export const createViolation = async (data: FormData) => {
  const response = await api.post('/violations/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getMyViolations = async () => {
  const response = await api.get('/violations/my/');
  return response.data;
};

// Board endpoints
export const getFinancialSummary = async () => {
  const response = await api.get('/board/financial-summary/');
  return response.data;
};
