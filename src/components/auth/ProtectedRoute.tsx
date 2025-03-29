
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
  const [authChecked, setAuthChecked] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);
  const hasRedirectedRef = useRef(false);
  const redirectTimeoutRef = useRef<number | null>(null);
  
  // Nettoyer le timeout lors du démontage
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);
  
  // Configuration optimisée de la requête d'authentification
  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth", location.pathname],
    queryFn: async () => {
      console.log("Vérification d'authentification pour:", location.pathname);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return { isAuthenticated: false };

        const { data: isAdmin, error } = await supabase.rpc('has_role', {
          user_id: user.id,
          role: 'admin'
        });

        return { 
          isAuthenticated: true,
          isAdmin
        };
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification:", error);
        return { isAuthenticated: false };
      }
    },
    staleTime: 1000 * 60 * 15, // 15 minutes pour réduire les vérifications fréquentes
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && !hasRedirectedRef.current) {
      // Logique de redirection
      if (!authData?.isAuthenticated) {
        // Ne pas rediriger vers login si on est sur la page changelog publique
        if (location.pathname === '/changelog') {
          setAuthChecked(true);
          return;
        }
        
        console.log("Redirection vers /login depuis ProtectedRoute");
        setShouldRedirect("/login");
      } 
      // Rediriger les admins vers /admin s'ils arrivent sur /dashboard
      else if (authData.isAdmin && location.pathname === '/dashboard') {
        console.log("Redirection admin vers /admin");
        setShouldRedirect("/admin");
      }
      // Vérifier si l'utilisateur peut accéder à cette page
      else if (requireAdmin && !isAdmin) {
        console.log("Redirection vers /dashboard - accès admin requis");
        setShouldRedirect("/dashboard");
      }
      // Vérifier les permissions spéciales pour les routes de détail
      else if (location.pathname.startsWith('/properties/') && !canAccessPage('/properties')) {
        console.log("Redirection - pas accès aux propriétés");
        setShouldRedirect("/dashboard");
      }
      else if (location.pathname.startsWith('/expenses/retailer/') && !canAccessPage('/expenses')) {
        console.log("Redirection - pas accès aux dépenses");
        setShouldRedirect("/dashboard");
      }
      // Vérifier les permissions générales
      else if (!canAccessPage(location.pathname) && 
               !location.pathname.includes('/user-settings') && 
               !location.pathname.includes('/settings')) {
        console.log("Redirection vers /dashboard - pas de permission");
        setShouldRedirect("/dashboard");
      }
      else {
        setAuthChecked(true);
      }
    }
  }, [isLoading, authData, location.pathname, canAccessPage, isAdmin, requireAdmin]);

  // Retourner un composant de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <StyledLoader/>
      </div>
    );
  }

  // Effectuer la redirection si nécessaire
  if (shouldRedirect) {
    hasRedirectedRef.current = true;
    
    // Utiliser Navigate avec state pour indiquer que c'est une navigation SPA
    return <Navigate 
      to={shouldRedirect} 
      state={{ from: location.pathname, isSpaNavigation: true }} 
      replace 
    />;
  }

  // Rendu des enfants une fois l'authentification vérifiée
  if (authChecked) {
    return <>{children}</>;
  }

  // État intermédiaire pendant la vérification
  return (
    <div className="flex items-center justify-center min-h-screen">
      <StyledLoader/>
    </div>
  );
});
