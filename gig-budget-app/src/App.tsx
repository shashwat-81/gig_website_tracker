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
import Navigation from './components/common/Navigation';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CustomThemeProvider>
          <CssBaseline />
          <Router>
            <Navigation>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/savings" element={<Savings />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Navigation>
          </Router>
        </CustomThemeProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
