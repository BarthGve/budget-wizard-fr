
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy load all other pages
const Dashboard = lazy(() => import("./pages/Index"));
const Contributors = lazy(() => import("./pages/Contributors"));
const UserSettings = lazy(() => import("./pages/UserSettings"));
const Savings = lazy(() => import("./pages/Savings"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const RecurringExpenses = lazy(() => import("./pages/RecurringExpenses"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Stocks = lazy(() => import("./pages/Stocks"));
const Credits = lazy(() => import("./pages/Credits"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminFeedbacks = lazy(() => import("./pages/admin/Feedbacks"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Configure React Query with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Routes protégées pour les utilisateurs normaux */}
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
              
              {/* Routes protégées pour les admins */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
              <Route path="/admin/feedbacks" element={<ProtectedRoute requireAdmin><AdminFeedbacks /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
