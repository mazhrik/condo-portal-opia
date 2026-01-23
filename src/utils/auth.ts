const REFRESH_TOKEN_KEY = "auth.refreshToken";

let accessToken: string | null = null;
const subscribers = new Set<(token: string | null) => void>();

const notify = () => {
  subscribers.forEach((callback) => callback(accessToken));
};

export const subscribeToAccessToken = (callback: (token: string | null) => void) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  notify();
};

export const getRefreshToken = (): string | null =>
  window.localStorage.getItem(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token: string) => {
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearTokens = () => {
  setAccessToken(null);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const hasRefreshToken = () => Boolean(getRefreshToken());
