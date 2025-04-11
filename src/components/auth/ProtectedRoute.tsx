
import { Navigate, useLocation } from "react-router-dom";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import StyledLoader from "../ui/StyledLoader";
import { memo, useRef, useEffect } from "react";
import { useAuthContext } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Optimisation avec memo pour éviter les re-renders inutiles
export const ProtectedRoute = memo(function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { canAccessPage, isAdmin } = usePagePermissions();
  const hasRedirectedRef = useRef(false);
  
  // Utiliser le contexte d'authentification au lieu de la requête directe
  const { isAuthenticated, loading } = useAuthContext();
  
  // Effet pour détecter les admins et les rediriger si nécessaire
  useEffect(() => {
    // IMPORTANT: Ne pas exécuter si une redirection est déjà en cours
    if (hasRedirectedRef.current) return;
    
    // Vérification prioritaire pour les administrateurs
    if (isAdmin && !loading) {
      // Rediriger vers /admin si l'utilisateur est sur dashboard ou racine
      if (!location.pathname.startsWith('/admin') && 
          (location.pathname === '/dashboard' || location.pathname === '/')) {
        console.log("Admin détecté dans ProtectedRoute - Redirection FORCÉE vers /admin");
        hasRedirectedRef.current = true;
        
        // Utiliser setTimeout pour éviter les conflits avec d'autres navigations
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 50);
        
        return; // Sortir immédiatement après avoir déclenché la redirection
      }
    }
  }, [isAdmin, location.pathname, navigate, loading]);

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <StyledLoader/>
      </div>
    );
  }

  // Éviter les redirections en boucle
  if (hasRedirectedRef.current) {
    return <>{children}</>;
  }

  // Debug pour comprendre l'état actuel
  console.log("ProtectedRoute - Path:", location.pathname, "Admin:", isAdmin, "Authenticated:", isAuthenticated);

  // Vérification de l'authentification
  if (!isAuthenticated) {
    // Ne pas rediriger vers login si on est sur la page changelog publique
    if (location.pathname === '/changelog') {
      return <>{children}</>;
    }
    
    // Marquer que nous avons redirigé
    hasRedirectedRef.current = true;
    
    // Utilisation de state pour préserver l'URL de redirection
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // IMPORTANT: Gestion prioritaire des routes admin
  // Si on est sur une route admin mais qu'on n'est pas admin, rediriger vers dashboard
  if (location.pathname.startsWith('/admin') && !isAdmin) {
    hasRedirectedRef.current = true;
    return <Navigate to="/dashboard" replace />;
  }
  
  // IMPORTANT: Rediriger les admins vers /admin s'ils sont sur dashboard ou racine
  // Cette vérification est redondante avec l'effet ci-dessus, mais sert de filet de sécurité
  if (isAdmin && (location.pathname === '/dashboard' || location.pathname === '/')) {
    console.log("Admin détecté - Redirection SECONDAIRE vers /admin");
    hasRedirectedRef.current = true;
    return <Navigate to="/admin" replace />;
  }

  // Si on requiert un admin mais que l'utilisateur n'est pas admin
  if (requireAdmin && !isAdmin) {
    hasRedirectedRef.current = true;
    return <Navigate to="/dashboard" replace />;
  }

  // Liste des routes toujours accessibles une fois connecté
  const alwaysAccessibleRoutes = ['/user-settings', '/settings'];
  
  // Permettre l'accès aux routes toujours accessibles
  if (alwaysAccessibleRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  // Gestion spéciale pour les routes de détail des propriétés
  if (location.pathname.startsWith('/properties/')) {
    // Si l'utilisateur peut accéder à /properties
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
