import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  hasRefreshToken,
  setAccessToken,
  setRefreshToken,
  subscribeToAccessToken,
} from "@/utils/auth";
import { getMe, login as loginRequest, refreshAccessToken } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextValue {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [accessToken, setAccessTokenState] = useState<string | null>(() => getAccessToken());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(() => hasRefreshToken());

  useEffect(() => subscribeToAccessToken(setAccessTokenState), []);

  const loadMe = useCallback(async () => {
    await queryClient.fetchQuery({
      queryKey: ["me"],
      queryFn: getMe,
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  const refreshSession = useCallback(async () => {
    const newToken = await refreshAccessToken();
    if (newToken) {
      await loadMe();
      return true;
    }
    queryClient.removeQueries({ queryKey: ["me"] });
    return false;
  }, [loadMe, queryClient]);

  useEffect(() => {
    const bootstrap = async () => {
      if (getRefreshToken() && !getAccessToken()) {
        setIsLoading(true);
        await refreshSession();
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    };

    bootstrap();
  }, [refreshSession]);

  const login = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const tokens = await loginRequest(email, password);
      setRefreshToken(tokens.refresh);
      setAccessToken(tokens.access);
      await loadMe();
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = useCallback(() => {
    clearTokens();
    queryClient.removeQueries({ queryKey: ["me"] });
  }, [queryClient]);

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isLoading,
      isSubmitting,
      login,
      logout,
      refreshSession,
    }),
    [accessToken, isLoading, isSubmitting, login, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
