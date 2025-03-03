
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Index";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import Expenses from "./pages/Expenses";
import RetailerDetail from "./pages/RetailerDetail";
import { AuthListener } from "./components/auth/AuthListener";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Stocks from "./pages/Stocks";
import Savings from "./pages/Savings";
import Credits from "./pages/Credits";
import Contributors from "./pages/Contributors";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RecurringExpenses from "./pages/RecurringExpenses";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Landing from "./pages/Landing";
import UserSettings from "./pages/UserSettings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Changelog from "./pages/Changelog";
import Admin from "./pages/Admin";
import Feedbacks from "./pages/admin/Feedbacks";

function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthListener />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/expenses" 
            element={<ProtectedRoute><Expenses /></ProtectedRoute>} 
          />
          <Route 
            path="/depenses/enseigne/:id" 
            element={<ProtectedRoute><RetailerDetail /></ProtectedRoute>} 
          />
          <Route 
            path="/recurring-expenses" 
            element={<ProtectedRoute><RecurringExpenses /></ProtectedRoute>} 
          />
          <Route 
            path="/stocks" 
            element={<ProtectedRoute><Stocks /></ProtectedRoute>} 
          />
          <Route 
            path="/savings" 
            element={<ProtectedRoute><Savings /></ProtectedRoute>} 
          />
          <Route 
            path="/credits" 
            element={<ProtectedRoute><Credits /></ProtectedRoute>} 
          />
          <Route 
            path="/contributors" 
            element={<ProtectedRoute><Contributors /></ProtectedRoute>} 
          />
          <Route 
            path="/properties" 
            element={<ProtectedRoute><Properties /></ProtectedRoute>} 
          />
          <Route 
            path="/properties/:id" 
            element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} 
          />
          <Route 
            path="/settings" 
            element={<ProtectedRoute><UserSettings /></ProtectedRoute>} 
          />
          <Route 
            path="/changelog" 
            element={<ProtectedRoute><Changelog /></ProtectedRoute>} 
          />
          <Route 
            path="/admin" 
            element={<ProtectedRoute><Admin /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/feedbacks" 
            element={<ProtectedRoute><Feedbacks /></ProtectedRoute>} 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
