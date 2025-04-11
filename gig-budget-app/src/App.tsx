import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { store } from './store';
import theme from './theme';

// Import components
import Dashboard from './components/dashboard/Dashboard';
import Settings from './components/settings/Settings';
import Budget from './components/budget/Budget';
import Savings from './components/savings/Savings';
import Reports from './components/reports/Reports';
import Layout from './components/common/Layout';
import IncomeTracker from './components/income/IncomeTracker';
import ExpenseTracker from './components/expense/ExpenseTracker';
import TaxManager from './components/tax/TaxManager';
import Achievements from './components/gamification/Achievements';
import Challenges from './components/gamification/Challenges';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CustomThemeProvider>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
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
              </Route>
            </Routes>
          </Router>
        </CustomThemeProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
