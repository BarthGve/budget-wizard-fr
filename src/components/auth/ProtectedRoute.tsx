
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useLocation } from "react-router-dom";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import StyledLoader from "../ui/StyledLoader";


interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const { canAccessPage, isAdmin } = usePagePermissions();

  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth", location.pathname],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isAuthenticated: false };

      const { data: isAdmin, error } = await supabase.rpc('has_role', { 
        user_id: user.id, 
        role: 'admin' 
      });
      
      return { isAuthenticated: true, isAdmin };
    },
    staleTime: 1000 * 60, // 1 minute
  });

  if (isLoading) {
    return <div><StyledLoader/></div>;
  }

  if (!authData?.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Liste des routes toujours accessibles une fois connecté
  const alwaysAccessibleRoutes = ['/user-settings', '/settings'];

  // Rediriger les admins vers /admin s'ils arrivent sur /dashboard
  if (authData.isAdmin && location.pathname === '/dashboard') {
    return <Navigate to="/admin" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/forbidden" />;
  }

  // Permettre l'accès aux routes toujours accessibles
  if (alwaysAccessibleRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  // Gestion spéciale pour les routes de détail des propriétés
  if (location.pathname.startsWith('/properties/')) {
    // Si c'est la page principale des propriétés ou si l'utilisateur peut accéder à /properties
    const canAccessProperties = canAccessPage('/properties');
    if (canAccessProperties) {
      return <>{children}</>;
    }
  }

  // Vérifier les permissions pour les autres routes
  if (!canAccessPage(location.pathname)) {
    return <Navigate to="/forbidden" />;
  }

  return <>{children}</>;
};