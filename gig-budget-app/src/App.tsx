import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { ThemeProvider as CustomThemeProvider, useTheme } from './context/ThemeContext';
import { store } from './store';
import { createAppTheme } from './theme';
import { getCurrentUser } from './services/authService';
import AuthRedirect from './components/auth/AuthRedirect';
import Layout from './components/common/Layout';
import { ExpenseProvider } from './context/ExpenseContext';
import { ChallengesProvider } from './context/ChallengesContext';
import { NotificationProvider } from './context/NotificationContext';

// Import components
import Dashboard from './components/dashboard/Dashboard';
import Settings from './components/settings/Settings';
import Budget from './components/budget/Budget';
import Savings from './components/savings/Savings';
import Reports from './components/reports/Reports';
import IncomeTracker from './components/income/IncomeTracker';
import ExpenseTracker from './components/expense/ExpenseTracker';
import TaxManager from './components/tax/TaxManager';
import Achievements from './components/gamification/Achievements';
import Challenges from './components/gamification/Challenges';
// Import the AI Insights Dashboard
import AIInsightsDashboard from './components/ai/AIInsightsDashboard';
import InteractiveFinancialInsights from './components/ai/InteractiveFinancialInsights';
// Import Login Page
import LoginPage from './pages/LoginPage';

// Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppContent: React.FC = () => {
  const { darkMode } = useTheme();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const theme = React.useMemo(() => createAppTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  useEffect(() => {
    setIsAuthChecked(true);
  }, []);

  if (!isAuthChecked) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <ExpenseProvider>
          <ChallengesProvider>
            <Router>
              <Routes>
                {/* Public route for login */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected routes */}
                <Route element={
                  <ProtectedRoute>
                    <AuthRedirect>
                      <Outlet />
                    </AuthRedirect>
                  </ProtectedRoute>
                }>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/income" element={<IncomeTracker />} />
                  <Route path="/savings" element={<Savings />} />
                  <Route path="/tax" element={<TaxManager />} />
                  <Route path="/budget" element={<Budget />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/expenses" element={<ExpenseTracker />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/challenges" element={<Challenges />} />
                  <Route path="/ai-insights" element={<AIInsightsDashboard />} />
                  <Route path="/interactive-insights" element={<InteractiveFinancialInsights />} />
                </Route>

                {/* Redirect all other routes to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </ChallengesProvider>
        </ExpenseProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <CustomThemeProvider>
        <AppContent />
      </CustomThemeProvider>
    </Provider>
  );
};

export default App;
