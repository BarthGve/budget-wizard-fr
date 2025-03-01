
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useLocation } from "react-router-dom";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useState, useEffect } from "react";
import StyledLoader from "@/components/ui/StyledLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const { canAccessPage, isAdmin } = usePagePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  
  // Utilisation d'un effet direct plutôt qu'une requête pour vérifier l'authentification initiale
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        const { data: adminStatus } = await supabase.rpc('has_role', {
          user_id: user.id,
          role: 'admin'
        });
        
        setUserIsAdmin(!!adminStatus);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [location.pathname]);

  // Utiliser une requête en arrière-plan pour maintenir à jour les informations d'authentification
  useQuery({
    queryKey: ["auth-background", location.pathname],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isAuthenticated: false };

      const { data: isAdmin } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });

      return { 
        isAuthenticated: true,
        isAdmin
      };
    },
    staleTime: 1000 * 60, // 1 minute
    enabled: isAuthenticated, // Seulement si l'utilisateur est déjà authentifié
    meta: {
      onSuccess: (data) => {
        if (data.isAuthenticated !== isAuthenticated) {
          setIsAuthenticated(data.isAuthenticated);
        }
        if (data.isAdmin !== userIsAdmin) {
          setUserIsAdmin(data.isAdmin);
        }
      }
    }
  });

  if (isLoading) {
    return <StyledLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Liste des routes toujours accessibles une fois connecté
  const alwaysAccessibleRoutes = ['/user-settings', '/settings'];
  
  // Rediriger les admins vers /admin s'ils arrivent sur /dashboard
  if (userIsAdmin && location.pathname === '/dashboard') {
    return <Navigate to="/admin" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
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
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
