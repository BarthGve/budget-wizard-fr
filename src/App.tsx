
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

// Pages d'authentification et publiques
import HomePage from "./pages/Index";
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
import UserSettings from "./pages/UserSettings";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";

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
  }, []);

  if (!mounted) {
    return null;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <Toaster richColors position="top-center" />
        <AuthProvider>
          <AuthWrapper>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/email-verification" element={<EmailVerification />} />
                
                {/* Routes protégées */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<UserSettings />} />
                  <Route path="user-settings" element={<UserSettings />} />
                </Route>
                
                {/* Routes de véhicules */}
                <Route 
                  path="/vehicles" 
                  element={
                    <ProtectedRoute>
                      <Vehicles />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/vehicles/:id" 
                  element={
                    <ProtectedRoute>
                      <VehicleDetail />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AuthWrapper>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
