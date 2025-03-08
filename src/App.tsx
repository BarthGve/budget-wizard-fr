
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import EmailVerification from "@/pages/EmailVerification";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthListener } from "@/components/auth/AuthListener";
import Admin from "@/pages/admin/Admin";
import AdminFeedbacks from "@/pages/admin/AdminFeedbacks";
import Changelog from "@/pages/admin/Changelog";
import NotFound from "@/pages/NotFound";
import Contributors from "@/pages/Contributors";
import Expenses from "@/pages/Expenses";
import RecurringExpenses from "@/pages/RecurringExpenses";
import Credits from "@/pages/Credits";
import Savings from "@/pages/Savings";
import Stocks from "@/pages/Stocks";
import Properties from "@/pages/Properties";
import UserSettings from "@/pages/UserSettings";
import { ContributionsPage } from "@/pages/admin/Contributions";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthListener>
          <main className="app">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              
              {/* Routes protégées */}
              <Route element={<ProtectedRoute>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Autres routes protégées */}
                  <Route path="/contributors" element={<Contributors />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/recurring-expenses" element={<RecurringExpenses />} />
                  <Route path="/credits" element={<Credits />} />
                  <Route path="/savings" element={<Savings />} />
                  <Route path="/stocks" element={<Stocks />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/user-settings" element={<UserSettings />} />
                  
                  {/* Routes Admin */}
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
                  <Route path="/admin/contributions" element={<ContributionsPage />} />
                  <Route path="/admin/changelog" element={<Changelog />} />
                </Routes>
              </ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </AuthListener>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
