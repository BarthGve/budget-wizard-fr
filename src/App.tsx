
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
        {/* Router est placé AVANT AuthProvider pour résoudre le problème d'utilisation de useNavigate */}
        <Router>
          <AuthProvider>
            <AuthWrapper>
              <Routes>
                {/* Pages publiques */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/email-verification" element={<EmailVerification />} />
                
                {/* Routes protégées avec layout dashboard */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <UserSettings />
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
                
                {/* Routes de véhicules */}
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
