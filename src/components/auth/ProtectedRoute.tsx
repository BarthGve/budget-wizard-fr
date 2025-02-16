
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isAuthenticated: false, isAdmin: false };

      const { data: isAdmin } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });
      return { isAuthenticated: true, isAdmin };
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!authData?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est un admin et essaie d'accéder à une route non-admin
  if (authData.isAdmin && !requireAdmin && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin" replace />;
  }

  // Si l'utilisateur n'est pas admin et essaie d'accéder à une route admin
  if (!authData.isAdmin && requireAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
