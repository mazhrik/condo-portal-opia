import axios from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/utils/auth";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          setTokens({ accessToken: res.data.access, refreshToken });
          error.config.headers.Authorization = `Bearer ${res.data.access}`;
          return api(error.config);
        } catch (refreshError) {
          clearTokens();
        }
      }
    }
    return Promise.reject(error);
  }
);

export type AuthTokens = {
  access: string;
  refresh: string;
  user_id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
};

export const login = async (username: string, password: string): Promise<AuthTokens> => {
  const response = await api.post<AuthTokens>("/token/", { username, password });
  return response.data;
};

export default api;
