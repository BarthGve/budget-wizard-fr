
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
    // Ne rediriger vers /admin que si l'utilisateur est exactement sur /dashboard ou / 
    // et ne pas rediriger s'il est déjà sur une sous-route de /admin
    if (isAdmin && !location.pathname.startsWith('/admin') && (location.pathname === '/dashboard' || location.pathname === '/')) {
      console.log("Admin détecté dans ProtectedRoute - Redirection vers /admin");
      if (!hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        // Utiliser navigate avec replace pour éviter l'empilement dans l'historique
        navigate('/admin', { replace: true });
      }
    }
  }, [isAdmin, location.pathname, navigate]);

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

  // Liste des routes toujours accessibles une fois connecté
  const alwaysAccessibleRoutes = ['/user-settings', '/settings'];
  
  // IMPORTANT: Gestion prioritaire pour les routes admin
  // Si l'utilisateur est admin et accède à une route admin, autoriser l'accès immédiatement
  if (location.pathname.startsWith('/admin') && isAdmin) {
    console.log("Accès autorisé à la route admin:", location.pathname);
    return <>{children}</>;
  }
  
  // IMPORTANT: Rediriger les admins vers /admin s'ils arrivent sur /dashboard ou sur la racine du site
  if (isAdmin && (location.pathname === '/dashboard' || location.pathname === '/')) {
    console.log("Admin détecté - Redirection vers /admin");
    hasRedirectedRef.current = true;
    return <Navigate to="/admin" replace />;
  }

  // Si on requiert un admin mais que l'utilisateur n'est pas admin
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
