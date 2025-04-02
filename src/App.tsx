
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

// Pages d'authentification et publiques
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import NotFound from "./pages/NotFound";

// Composants pour la structure
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import AuthProvider from "./context/AuthProvider";
import { AuthWrapper } from "./components/auth/AuthWrapper";

// Import des pages principales (contenu protégé)
import Dashboard from "./pages/Dashboard";
import UserSettings from "./pages/UserSettings";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import Contributors from "./pages/Contributors";
import Expenses from "./pages/Expenses";
import RetailerDetail from "./pages/RetailerDetail";
import RecurringExpenses from "./pages/RecurringExpenses";
import Credits from "./pages/Credits";
import Savings from "./pages/Savings";
import Stocks from "./pages/Stocks";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";

// Import des pages d'administration
import Admin from "./pages/Admin";
import AdminFeedbacks from "./pages/admin/Feedbacks";
import AdminUsers from "./pages/admin/Users";
import AdminPermissions from "./pages/admin/Permissions";
import Changelog from "./pages/Changelog";
import { ChangelogPage } from "./components/changelog/ChangelogPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Debug pour vérifier l'état du thème au chargement
    const currentTheme = localStorage.getItem('theme');
    console.log("Theme initial:", currentTheme);
    
    // Forcer une mise à jour des classes pour appliquer le thème
    const applyThemeClass = () => {
      const theme = localStorage.getItem('theme');
      const isDark = theme === 'dark' || 
                    (theme === 'system' && 
                     window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    applyThemeClass();
    
    // Réappliquer à chaque changement de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyThemeClass();
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!mounted) {
    return null;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
      >
        <Toaster richColors position="top-center" />
        <Router>
          <AuthProvider>
            <AuthWrapper>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/email-verification" element={<EmailVerification />} />
                <Route path="/changelog" element={<Changelog />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/user-settings" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <UserSettings />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/vehicles" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Vehicles />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/vehicles/:id" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <VehicleDetail />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/contributors" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Contributors />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/expenses" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Expenses />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/expenses/retailer/:id" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <RetailerDetail />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/recurring-expenses" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <RecurringExpenses />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/credits" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Credits />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/savings" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Savings />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/stocks" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Stocks />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/properties" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Properties />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/properties/:id" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PropertyDetail />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/feedbacks" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminFeedbacks />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/users" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/permissions" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPermissions />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/changelog" element={
                  <ProtectedRoute requireAdmin={true}>
                    <DashboardLayout>
                      <ChangelogPage isAdmin={true} />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthWrapper>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
