import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import ChangelogPublic from "./pages/ChangelogPublic";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserSettings from "./pages/UserSettings";
import Settings from "./pages/Settings";
import PropertiesPage from "./pages/properties/PropertiesPage";
import PropertyDetailsPage from "./pages/properties/PropertyDetailsPage";
import ExpensesPage from "./pages/expenses/ExpensesPage";
import RetailerExpenseDetails from "./pages/expenses/RetailerExpenseDetails";
import RecurringExpensesPage from "./pages/expenses/RecurringExpensesPage";
import CreditsPage from "./pages/credits/CreditsPage";
import SavingsPage from "./pages/savings/SavingsPage";
import ContributorsPage from "./pages/contributors/ContributorsPage";
import AuthProvider from "./context/AuthProvider";
import { AuthWrapper } from "./components/auth/AuthWrapper";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Eviter les requêtes inutiles
      retry: false, // Ne pas relancer les requêtes en cas d'erreur
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
                <Route path="/changelog" element={<ChangelogPublic />} />
                
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
                  <Route path="settings" element={<Settings />} />
                  <Route path="properties" element={<PropertiesPage />} />
                  <Route path="properties/:id" element={<PropertyDetailsPage />} />
                  <Route path="expenses" element={<ExpensesPage />} />
                  <Route path="expenses/retailer/:id" element={<RetailerExpenseDetails />} />
                  <Route path="recurring-expenses" element={<RecurringExpensesPage />} />
                  <Route path="credits" element={<CreditsPage />} />
                  <Route path="savings" element={<SavingsPage />} />
                  <Route path="contributors" element={<ContributorsPage />} />
                </Route>
                
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
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
