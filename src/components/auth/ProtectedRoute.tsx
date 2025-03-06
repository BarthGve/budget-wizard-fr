
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useLocation } from "react-router-dom";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import StyledLoader from "../ui/StyledLoader";
import { memo } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Optimisation avec memo pour éviter les re-renders inutiles
export const ProtectedRoute = memo(function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const location = useLocation();
  const { canAccessPage, isAdmin } = usePagePermissions();
  
  // Configuration optimisée de la requête d'authentification
  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user) return { isAuthenticated: false };

      const { data: isAdmin, error } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });

      return { 
        isAuthenticated: true,
        isAdmin
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes pour réduire les vérifications fréquentes
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnMount: true,
    refetchOnReconnect: false, // Désactiver le refetch à la reconnexion
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <StyledLoader/>
      </div>
    );
  }

  if (!authData?.isAuthenticated) {
    // Utilisation de state pour préserver l'URL de redirection
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Debugging log for current path
  console.log("Current path in ProtectedRoute:", location.pathname);

  // Liste des routes toujours accessibles une fois connecté
  const alwaysAccessibleRoutes = ['/user-settings', '/settings'];
  
  // Rediriger les admins vers /admin s'ils arrivent sur /dashboard
  if (authData.isAdmin && location.pathname === '/dashboard') {
    return <Navigate to="/admin" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
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

  // Gestion spéciale pour les routes de détail des enseignes
  if (location.pathname.startsWith('/expenses/retailer/')) {
    console.log("Retailer detail route detected in ProtectedRoute");
    // Si l'utilisateur peut accéder à /expenses, il peut accéder aux détails des enseignes
    const canAccessExpenses = canAccessPage('/expenses');
    if (canAccessExpenses) {
      return <>{children}</>;
    }
  }

  // Vérifier les permissions pour les autres routes
  if (!canAccessPage(location.pathname)) {
    console.log("Access denied to path:", location.pathname);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
});
