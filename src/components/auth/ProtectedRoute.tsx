
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();

  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isAuthenticated: false, isAdmin: false };

      const { data: isAdmin } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });

      return { 
        isAuthenticated: true,
        isAdmin: !!isAdmin
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!authData?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Liste des routes toujours accessibles une fois connecté
  const alwaysAccessibleRoutes = ['/user-settings', '/settings'];
  
  // Rediriger les admins vers /admin s'ils arrivent sur /dashboard
  if (authData.isAdmin && location.pathname === '/dashboard') {
    return <Navigate to="/admin" replace />;
  }

  if (requireAdmin && !authData.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Permettre l'accès aux routes toujours accessibles
  if (alwaysAccessibleRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  // For property detail routes
  if (location.pathname.startsWith('/properties/')) {
    // Allow access if it's a valid property route
    return <>{children}</>;
  }

  // Default case: allow access
  return <>{children}</>;
};

