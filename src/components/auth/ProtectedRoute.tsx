
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useLocation } from "react-router-dom";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useEffect, useRef } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { canAccessPage, isAdmin } = usePagePermissions();
  const previousPathRef = useRef<string | null>(null);
  
  // Optimisé pour éviter les rechargements inutiles
  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isAuthenticated: false };

      // Uniquement vérifier le rôle admin si nécessaire
      if (requireAdmin || location.pathname.startsWith('/admin')) {
        const { data: isAdmin, error } = await supabase.rpc('has_role', {
          user_id: user.id,
          role: 'admin'
        });
        
        return { 
          isAuthenticated: true,
          isAdmin,
          userId: user.id
        };
      }

      return { 
        isAuthenticated: true,
        isAdmin: false,
        userId: user.id
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - réduire le nombre de requêtes
    cacheTime: 1000 * 60 * 10 // 10 minutes
  });

  // N'invalidez les requêtes d'authentification que lors des changements de route significatifs
  useEffect(() => {
    // Vérifiez si c'est un véritable changement de route, pas juste des paramètres de requête ou des ancres
    const isRealPathChange = previousPathRef.current !== location.pathname;
    
    if (isRealPathChange && 
        location.pathname !== '/login' && 
        location.pathname !== '/register' &&
        previousPathRef.current !== null) {
      // Invalider uniquement lors d'un vrai changement de route et non au montage initial
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    }
    
    previousPathRef.current = location.pathname;
  }, [location.pathname, queryClient]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!authData?.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Liste des routes toujours accessibles une fois connecté
  const alwaysAccessibleRoutes = ['/user-settings', '/settings'];
  
  // Rediriger les admins vers /admin s'ils arrivent sur /dashboard
  if (authData.isAdmin && location.pathname === '/dashboard') {
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
