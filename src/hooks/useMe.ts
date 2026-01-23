import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getMe } from "@/utils/api";

const STALE_TIME_MS = 5 * 60 * 1000;

export const useMe = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: isAuthenticated,
    staleTime: STALE_TIME_MS,
  });
};
