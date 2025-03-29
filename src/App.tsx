
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Dashboard from "./pages/Index";
import Contributors from "./pages/Contributors";
import UserSettings from "./pages/UserSettings";
import Savings from "./pages/Savings";
import NotFound from "./pages/NotFound";
import RecurringExpenses from "./pages/RecurringExpenses";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Admin from "./pages/Admin";
import AdminFeedbacks from "./pages/admin/Feedbacks";
import Stocks from "./pages/Stocks";
import Credits from "./pages/Credits";
import Expenses from "./pages/Expenses";
import RetailerDetail from "./pages/RetailerDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Changelog from "./pages/Changelog";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import EmailVerification from "./pages/EmailVerification";
import { AuthListener } from "./components/auth/AuthListener";
import { useState, useEffect, useCallback } from "react";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import { UpdateNotification } from "./components/layout/UpdateNotification";

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));
  
  // Marquer explicitement que nous utilisons une navigation SPA
  useEffect(() => {
    sessionStorage.setItem('spa_active', 'true');
    
    // Créer un débouncer pour limiter le nombre de mises à jour de l'historique
    let debouncerTimeout: number | null = null;
    const debounceDuration = 300; // ms
    
    // Fonction optimisée pour gérer les clics sur les liens
    const handleLinkClicks = useCallback((e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && 
          anchor.getAttribute('href')?.startsWith('/') && 
          !anchor.getAttribute('target') && 
          !anchor.getAttribute('download')) {
        
        // Ne pas recharger pour les liens internes
        e.preventDefault();
        
        // Débouncer les mises à jour de l'historique
        if (debouncerTimeout) {
          clearTimeout(debouncerTimeout);
        }
        
        // Utiliser l'historique du navigateur à la place
        const href = anchor.getAttribute('href');
        if (href && href !== location.pathname) {
          debouncerTimeout = window.setTimeout(() => {
            history.pushState({ 
              isSpaNavigation: true,
              timestamp: Date.now() 
            }, '', href);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }, debounceDuration);
        }
      }
    }, []);
    
    document.addEventListener('click', handleLinkClicks);
    
    return () => {
      document.removeEventListener('click', handleLinkClicks);
      if (debouncerTimeout) {
        clearTimeout(debouncerTimeout);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <UpdateNotification />
          <BrowserRouter>
            <AuthListener />
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/changelog" element={<Changelog />} /> {/* Route publique pour le changelog */}
              
              {/* Routes protégées */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/contributors" element={<ProtectedRoute><Contributors /></ProtectedRoute>} />
              <Route path="/user-settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
              <Route path="/savings" element={<ProtectedRoute><Savings /></ProtectedRoute>} />
              <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
              <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
              <Route path="/recurring-expenses" element={<ProtectedRoute><RecurringExpenses /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
              <Route path="/expenses/retailer/:id" element={<ProtectedRoute><RetailerDetail /></ProtectedRoute>} />
              <Route path="/stocks" element={<ProtectedRoute><Stocks /></ProtectedRoute>} />
              <Route path="/credits" element={<ProtectedRoute><Credits /></ProtectedRoute>} />
              <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
              <Route path="/vehicles/:id" element={<ProtectedRoute><VehicleDetail /></ProtectedRoute>} />
              
              <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
              <Route path="/admin/feedbacks" element={<ProtectedRoute requireAdmin><AdminFeedbacks /></ProtectedRoute>} />
              <Route path="/admin/changelog" element={<ProtectedRoute requireAdmin><Changelog /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
