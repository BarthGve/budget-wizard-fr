
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Changelog from "./pages/Changelog";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import EmailVerification from "./pages/EmailVerification";
import { AuthListener } from "./components/auth/AuthListener";
import { useState } from "react";

// AnimatedRoutes component to handle animations
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/changelog" element={<Changelog />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/contributors" element={<ProtectedRoute><Contributors /></ProtectedRoute>} />
        <Route path="/user-settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
        <Route path="/savings" element={<ProtectedRoute><Savings /></ProtectedRoute>} />
        <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
        <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
        <Route path="/recurring-expenses" element={<ProtectedRoute><RecurringExpenses /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        <Route path="/stocks" element={<ProtectedRoute><Stocks /></ProtectedRoute>} />
        <Route path="/credits" element={<ProtectedRoute><Credits /></ProtectedRoute>} />
        
        <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
        <Route path="/admin/feedbacks" element={<ProtectedRoute requireAdmin><AdminFeedbacks /></ProtectedRoute>} />
        <Route path="/admin/changelog" element={<ProtectedRoute requireAdmin><Changelog /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

// Configurer React Query avec des options optimisées
const App = () => {
  // Create a new instance of QueryClient for each app render to avoid shared cache between reloads
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Augmenter le staleTime pour éviter les rechargements fréquents
        staleTime: 1000 * 60 * 5, // 5 minutes
        // Définir explicitly refetchOnMount à false pour éviter les rechargements lors de la navigation
        refetchOnMount: false,
        // Garder refetchOnWindowFocus désactivé
        refetchOnWindowFocus: false,
        // Définir garbage collection time plus long pour conserver les données en cache
        gcTime: 1000 * 60 * 30, // 30 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* AuthListener doit être à l'intérieur du BrowserRouter pour que useNavigate fonctionne */}
            <AuthListener />
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
