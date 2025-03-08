import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from './components/ui/button';
import StyledLoader from './components/ui/StyledLoader';
import Admin from './pages/Admin';
import Feedbacks from './pages/admin/Feedbacks';
import Changelog from './pages/admin/Changelog';
import Contributions from "./pages/admin/Contributions";

const queryClient = new QueryClient();

function AuthListener() {
  const { toast } = useToast();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session?.provider_token) {
      toast({
        title: "Connexion réussie !",
        description: `Bienvenue !`,
      })
    }
  }, [session?.provider_token, toast])

  if (loading) {
    return null;
  }

  // Rediriger vers le tableau de bord après la connexion si ce n'est pas déjà fait
  if (session && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return null;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating loading time
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        defaultTheme="system"
        enableSystem
        attribute="class"
      >
        <Toaster />
        <BrowserRouter>
          <StyledLoader />
          <AuthListener />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<PublicPage />} />
            <Route path="/register" element={<PublicPage />} />
            <Route path="/forgot-password" element={<PublicPage />} />
            <Route path="/reset-password" element={<PublicPage />} />
            <Route path="/unsubcribe" element={<PublicPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-settings" element={<UserSettings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/expenses/retailer/:retailerId" element={<ExpensesRetailerDetail />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:propertyId" element={<PropertyDetail />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/feedbacks" element={<Feedbacks />} />
            <Route path="/admin/changelog" element={<Changelog />} />
            <Route path="/admin/contributions" element={<Contributions />} />
            
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
