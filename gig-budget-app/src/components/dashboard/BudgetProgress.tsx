import React from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';

const BudgetProgress: React.FC = () => {
  const budgetData = {
    total: 50000,
    spent: 35000,
    remaining: 15000,
    categories: [
      { name: 'Housing', spent: 12000, budget: 15000 },
      { name: 'Food', spent: 8000, budget: 10000 },
      { name: 'Transportation', spent: 5000, budget: 8000 },
      { name: 'Entertainment', spent: 4000, budget: 5000 },
      { name: 'Savings', spent: 6000, budget: 12000 },
    ],
  };

  const overallProgress = (budgetData.spent / budgetData.total) * 100;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Overall Budget Progress
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            Spent: ₹{budgetData.spent.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Remaining: ₹{budgetData.remaining.toLocaleString()}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={overallProgress}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        Category Breakdown
      </Typography>
      {budgetData.categories.map((category) => {
        const progress = (category.spent / category.budget) * 100;
        return (
          <Paper key={category.name} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{category.name}</Typography>
              <Typography variant="body2">
                ₹{category.spent.toLocaleString()} / ₹{category.budget.toLocaleString()}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Paper>
        );
      })}
    </Box>
  );
};

export default BudgetProgress; 