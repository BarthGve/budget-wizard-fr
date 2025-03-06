import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthListener } from "@/components/auth/AuthListener";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import StyledLoader from "@/components/ui/StyledLoader";

// Lazy-loaded page components
const Landing = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Index = lazy(() => import("@/pages/Index"));
const EmailVerification = lazy(() => import("@/pages/EmailVerification"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Contributors = lazy(() => import("@/pages/Contributors"));
const RecurringExpenses = lazy(() => import("@/pages/RecurringExpenses"));
const Admin = lazy(() => import("@/pages/Admin"));
const Properties = lazy(() => import("@/pages/Properties"));
const PropertyDetail = lazy(() => import("@/pages/PropertyDetail"));
const Expenses = lazy(() => import("@/pages/Expenses"));
const RetailerDetail = lazy(() => import("@/pages/RetailerDetail"));
const UserSettings = lazy(() => import("@/pages/UserSettings"));
const Savings = lazy(() => import("@/pages/Savings"));
const Credits = lazy(() => import("@/pages/Credits"));
const Stocks = lazy(() => import("@/pages/Stocks"));
const Changelog = lazy(() => import("@/pages/Changelog"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Unsubscribe = lazy(() => import("@/pages/Unsubscribe"));

function App() {
  return (
    <BrowserRouter>
      <AuthListener />
      <Suspense fallback={<StyledLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/contributors"
            element={
              <ProtectedRoute>
                <Contributors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recurring-expenses"
            element={
              <ProtectedRoute>
                <RecurringExpenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties"
            element={
              <ProtectedRoute>
                <Properties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/:id"
            element={
              <ProtectedRoute>
                <PropertyDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/retailers/:id"
            element={
              <ProtectedRoute>
                <RetailerDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <UserSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/savings"
            element={
              <ProtectedRoute>
                <Savings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/credits"
            element={
              <ProtectedRoute>
                <Credits />
              </ProtectedRoute>
            }
          />
           <Route
            path="/stocks"
            element={
              <ProtectedRoute>
                <Stocks />
              </ProtectedRoute>
            }
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster position="top-right" closeButton />
    </BrowserRouter>
  );
}

export default App;
