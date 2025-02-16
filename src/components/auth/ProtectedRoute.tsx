
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isAuthenticated: false, isAdmin: false };

      if (requireAdmin) {
        const { data: isAdmin } = await supabase.rpc('has_role', {
          user_id: user.id,
          role: 'admin'
        });
        return { isAuthenticated: true, isAdmin };
      }

      return { isAuthenticated: true, isAdmin: false };
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!authData?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !authData.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (authData.isAdmin && !requireAdmin && window.location.pathname !== "/admin" && window.location.pathname !== "/admin/feedbacks") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
