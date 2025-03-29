
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
  const isFirstRender = useRef(true);
  const loadingTimeoutRef = useRef<number | null>(null);
  
  // Nettoyer les timeouts lors du démontage
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Définir un délai maximum pour le loader
  useEffect(() => {
    // Si après 5 secondes on est toujours sur le loader, essayer de récupérer la session localement
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (!authChecked && !shouldRedirect) {
        console.log("Délai de chargement dépassé, vérification session locale");
        try {
          const storedAuth = sessionStorage.getItem('auth_state');
          if (storedAuth) {
            const parsedAuth = JSON.parse(storedAuth);
            if (parsedAuth && parsedAuth.data) {
              console.log("Utilisation des données d'authentification en cache (fallback)");
              setAuthChecked(true);
            } else {
              // Redirection vers login en cas d'échec
              setShouldRedirect("/login");
            }
          } else {
            // Redirection vers login si pas de données
            setShouldRedirect("/login");
          }
        } catch (e) {
          console.error("Erreur lors de la récupération de la session", e);
          setShouldRedirect("/login");
        }
      }
    }, 5000); // 5 secondes de délai maximum
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [authChecked, shouldRedirect]);
  
  // Configuration optimisée de la requête d'authentification
  const { data: authData, isLoading, isError } = useQuery({
    queryKey: ["auth", location.pathname],
    queryFn: async () => {
      // Si c'est le premier rendu, utiliser les données de session locales si disponibles 
      // pour éviter un rechargement complet de la page
      if (isFirstRender.current) {
        isFirstRender.current = false;
        
        // Vérifier si nous avons des données en session storage
        const storedAuth = sessionStorage.getItem('auth_state');
        if (storedAuth) {
          try {
            const parsedAuth = JSON.parse(storedAuth);
            if (parsedAuth && new Date().getTime() - parsedAuth.timestamp < 300000) { // 5 minutes 
              console.log("Utilisation des données d'authentification en cache");
              return parsedAuth.data;
            }
          } catch (e) {
            console.error("Erreur lors de la lecture des données d'authentification en cache", e);
          }
        }
      }
      
      console.log("Vérification d'authentification pour:", location.pathname);
      try {
        // Ne pas vérifier l'authentification pour la page changelog publique
        if (location.pathname === '/changelog') {
          return { isAuthenticated: true };
        }
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return { isAuthenticated: false };

        const { data: isAdmin, error } = await supabase.rpc('has_role', {
          user_id: user.id,
          role: 'admin'
        });

        const authData = { 
          isAuthenticated: true,
          isAdmin
        };
        
        // Stocker les données en session storage pour les utiliser lors du prochain rendu
        sessionStorage.setItem('auth_state', JSON.stringify({
          data: authData,
          timestamp: new Date().getTime()
        }));
        
        return authData;
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
    retry: 1, // Limiter à une seule tentative pour éviter les boucles
  });

  useEffect(() => {
    // Gérer les erreurs de requête
    if (isError) {
      console.log("Erreur lors de la vérification d'authentification, redirection vers /login");
      setShouldRedirect("/login");
      return;
    }
    
    // Éviter la vérification si la redirection est déjà en cours
    if (isLoading || hasRedirectedRef.current) return;
    
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
  }, [isLoading, authData, location.pathname, canAccessPage, isAdmin, requireAdmin, isError]);

  // Retourner un composant de chargement pendant la vérification
  if (isLoading && !authChecked && !shouldRedirect) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <StyledLoader/>
      </div>
    );
  }

  // Effectuer la redirection si nécessaire
  if (shouldRedirect && !hasRedirectedRef.current) {
    hasRedirectedRef.current = true;
    
    // Utiliser Navigate avec state pour indiquer que c'est une navigation SPA
    // Et forcer le replace pour éviter de polluer l'historique
    return <Navigate 
      to={shouldRedirect} 
      state={{ 
        from: location.pathname, 
        isSpaNavigation: true, 
        timestamp: Date.now(),
        noReload: true // Indiquer explicitement de ne pas recharger
      }} 
      replace 
    />;
  }

  // Rendu des enfants une fois l'authentification vérifiée
  if (authChecked) {
    return <>{children}</>;
  }

  // État intermédiaire pendant la vérification (ne devrait pas rester trop longtemps)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <StyledLoader/>
    </div>
  );
});
