import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { store } from './store';
import theme from './theme';
import { getCurrentUser } from './services/authService';
import AuthRedirect from './components/auth/AuthRedirect';
import Layout from './components/common/Layout';
import { ExpenseProvider } from './context/ExpenseContext';

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
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Check if user is already authenticated on app load
  useEffect(() => {
    setIsAuthChecked(true);
  }, []);

  if (!isAuthChecked) {
    return null; // Don't render anything until auth check is complete
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CustomThemeProvider>
          <CssBaseline />
          <ExpenseProvider>
            <Router>
              <AuthRedirect>
                <Routes>
                  {/* Public route for login */}
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="/budget" element={<Budget />} />
                    <Route path="/savings" element={<Savings />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/income" element={<IncomeTracker />} />
                    <Route path="/expenses" element={<ExpenseTracker />} />
                    <Route path="/tax" element={<TaxManager />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/ai-insights" element={<AIInsightsDashboard />} />
                    <Route path="/interactive-insights" element={<InteractiveFinancialInsights />} />
                  </Route>
                  
                  {/* Redirect all other routes to login */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </AuthRedirect>
            </Router>
          </ExpenseProvider>
        </CustomThemeProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
