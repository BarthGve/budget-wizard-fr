import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import './App.css';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import OfflinePlaceholder from './components/OfflinePlaceholder';
import { useTheme } from './hooks/useTheme';
import { ThemeProvider } from './context/ThemeContext';
import { useLoading } from './hooks/useLoading';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Expenses = lazy(() => import('./pages/Expenses'));
const AddExpense = lazy(() => import('./pages/AddExpense'));
const EditExpense = lazy(() => import('./pages/EditExpense'));
const Credits = lazy(() => import('./pages/Credits'));
const AddCredit = lazy(() => import('./pages/AddCredit'));
const EditCredit = lazy(() => import('./pages/EditCredit'));
const Retailers = lazy(() => import('./pages/Retailers'));
const AddRetailer = lazy(() => import('./pages/AddRetailer'));
const EditRetailer = lazy(() => import('./pages/EditRetailer'));
const Categories = lazy(() => import('./pages/Categories'));
const AddCategory = lazy(() => import('./pages/AddCategory'));
const EditCategory = lazy(() => import('./pages/EditCategory'));
const Savings = lazy(() => import('./pages/Savings'));
const AddSaving = lazy(() => import('./pages/AddSaving'));
const EditSaving = lazy(() => import('./pages/EditSaving'));
const UserSettings = lazy(() => import('./pages/UserSettings'));
const TestCreditNotification = lazy(() => import('./pages/TestCreditNotification'));

function App() {
  const online = useOnlineStatus();
  const { theme } = useTheme();
  const location = useLocation();
  const { loading } = useLoading();

  const [rootClasses, setRootClasses] = useState(
    'default-theme transition-colors duration-500'
  );

  useEffect(() => {
    setRootClasses(`${theme} transition-colors duration-500`);
  }, [theme]);

  return (
    <div className={rootClasses}>
      <AuthProvider>
        <ThemeProvider>
          <ErrorBoundary>
            {loading && <Loading />}
            {!online ? (
              <OfflinePlaceholder />
            ) : (
              <Suspense fallback={<div>Chargement...</div>}>
                <Routes>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<DashboardLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="/expenses" element={<Expenses />} />
                      <Route path="/expenses/add" element={<AddExpense />} />
                      <Route path="/expenses/edit/:id" element={<EditExpense />} />
                      <Route path="/credits" element={<Credits />} />
                      <Route path="/credits/add" element={<AddCredit />} />
                      <Route path="/credits/edit/:id" element={<EditCredit />} />
                      <Route path="/retailers" element={<Retailers />} />
                      <Route path="/retailers/add" element={<AddRetailer />} />
                      <Route path="/retailers/edit/:id" element={<EditRetailer />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/categories/add" element={<AddCategory />} />
                      <Route path="/categories/edit/:id" element={<EditCategory />} />
                      <Route path="/savings" element={<Savings />} />
                      <Route path="/savings/add" element={<AddSaving />} />
                      <Route path="/savings/edit/:id" element={<EditSaving />} />
                      <Route path="/user-settings" element={<UserSettings />} />
                      <Route path="/test-credit-notification" element={<TestCreditNotification />} />
                    </Route>
                  </Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<div>Page Not Found</div>} />
                </Routes>
              </Suspense>
            )}
          </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
