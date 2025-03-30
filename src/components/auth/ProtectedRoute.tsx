import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useLocation } from "react-router-dom";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import StyledLoader from "../ui/StyledLoader";
import { memo, useRef, useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Optimisation avec memo pour éviter les re-renders inutiles
export const ProtectedRoute = memo(function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const location = useLocation();
  const { canAccessPage, isAdmin } = usePagePermissions();
  const hasRedirectedRef = useRef(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Vérifier dans sessionStorage si on est déjà authentifié
  const cachedAuthState = sessionStorage.getItem('is_authenticated') === 'true';
  
  // Configuration optimisée de la requête d'authentification
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["auth", location.pathname],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user) return { isAuthenticated: false };

      const { data: isAdmin, error } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });

      // Mettre à jour sessionStorage avec l'état d'authentification
      sessionStorage.setItem('is_authenticated', 'true');

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
    retry: 1,
    // Remplacer keepPreviousData par placeholderData qui est l'équivalent dans React Query v5+
    placeholderData: cachedAuthState ? () => ({ isAuthenticated: true, isAdmin: false }) : undefined,
    // Si cachedAuthState est true, on initialise avec une valeur par défaut pour éviter le flash de chargement
    initialData: cachedAuthState ? { isAuthenticated: true, isAdmin: false } : undefined,
  });

  // Si le chargement prend plus de 5 secondes, on considère qu'il y a un problème
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Si le chargement a pris trop de temps, on utilise les données en cache ou on redirige
  if (isLoading && !loadingTimeout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <StyledLoader/>
      </div>
    );
  }

  // Si le chargement a expiré mais qu'on a un état en cache, on utilise l'état en cache
  if (loadingTimeout && cachedAuthState) {
    return <>{children}</>;
  }
  
  // Si le chargement a expiré et qu'on n'a pas d'état en cache, on redirige
  if (loadingTimeout && !cachedAuthState) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Éviter les redirections en boucle
  if (hasRedirectedRef.current) {
    return <>{children}</>;
  }

  if (!authData?.isAuthenticated) {
    // Ne pas rediriger vers login si on est sur la page changelog publique
    if (location.pathname === '/changelog') {
      return <>{children}</>;
    }
    
    // Marquer que nous avons redirigé
    hasRedirectedRef.current = true;
    
    // Utilisation de state pour préserver l'URL de redirection
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Liste des routes toujours accessibles une fois connecté
  const alwaysAccessibleRoutes = ['/user-settings', '/settings'];
  
  // Rediriger les admins vers /admin s'ils arrivent sur /dashboard
  if (authData.isAdmin && location.pathname === '/dashboard') {
    hasRedirectedRef.current = true;
    return <Navigate to="/admin" replace />;
  }

  if (requireAdmin && !isAdmin) {
    hasRedirectedRef.current = true;
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

  // Gestion spéciale pour les routes de détail des enseignes
  if (location.pathname.startsWith('/expenses/retailer/')) {
    // Si l'utilisateur peut accéder à /expenses, il peut accéder aux détails des enseignes
    const canAccessExpenses = canAccessPage('/expenses');
    if (canAccessExpenses) {
      return <>{children}</>;
    }
  }

  // Vérifier les permissions pour les autres routes
  if (!canAccessPage(location.pathname)) {
    hasRedirectedRef.current = true;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
});
