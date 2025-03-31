
import { Navigate, useLocation } from "react-router-dom";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import StyledLoader from "../ui/StyledLoader";
import { memo, useRef } from "react";
import { useAuthContext } from "@/context/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Optimisation avec memo pour éviter les re-renders inutiles
export const ProtectedRoute = memo(function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const location = useLocation();
  const { canAccessPage, isAdmin } = usePagePermissions();
  const hasRedirectedRef = useRef(false);
  
  // Utiliser le contexte d'authentification au lieu de la requête directe
  const { isAuthenticated, loading } = useAuthContext();
  
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
  
  // Rediriger les admins vers /admin s'ils arrivent sur /dashboard
  if (isAdmin && location.pathname === '/dashboard') {
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
