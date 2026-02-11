import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMe } from "@/hooks/useMe";
import { Role } from "@/utils/api";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  requireBoardMember?: boolean;
}

const ProtectedRoute = ({ allowedRoles, requireBoardMember }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: me, isLoading: meLoading } = useMe();
  const location = useLocation();

  if (isLoading || (isAuthenticated && meLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const isStaff = me?.role === "admin" || me?.role === "manager";
  const isBoardMember = me?.resident?.is_board_member || isStaff;

  if (requireBoardMember && !isBoardMember) {
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedRoles && me && !allowedRoles.includes(me.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
