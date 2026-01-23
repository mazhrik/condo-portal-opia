import { createContext, useContext, useMemo, useState } from "react";
import { clearTokens, getAccessToken, setTokens } from "@/utils/auth";
import { login as loginRequest } from "@/utils/api";

interface AuthContextValue {
  accessToken: string | null;
  isAuthenticated: boolean;
  isSubmitting: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => getAccessToken());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const tokens = await loginRequest(email, password);
      setTokens({ accessToken: tokens.access, refreshToken: tokens.refresh });
      setAccessToken(tokens.access);
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    clearTokens();
    setAccessToken(null);
  };

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isSubmitting,
      login,
      logout,
    }),
    [accessToken, isSubmitting]
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
