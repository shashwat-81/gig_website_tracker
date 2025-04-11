import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { useExpenses, Expense } from '../../context/ExpenseContext';

interface ExportReportProps {
  onExportComplete?: () => void;
}

const ExportReport: React.FC<ExportReportProps> = ({ onExportComplete }) => {
  const { expenses } = useExpenses();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const exportToExcel = () => {
    // Prepare the data for Excel
    const excelData = expenses.map((expense: Expense) => ({
      'Date': formatDate(expense.date),
      'Category': expense.category,
      'Description': expense.description,
      'Amount (₹)': expense.amount.toFixed(2),
      'Payment Method': expense.paymentMethod,
      'Status': expense.status,
      'Notes': expense.notes || ''
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Date
      { wch: 15 }, // Category
      { wch: 30 }, // Description
      { wch: 12 }, // Amount
      { wch: 15 }, // Payment Method
      { wch: 12 }, // Status
      { wch: 30 }  // Notes
    ];
    ws['!cols'] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Expense Report');

    // Generate the Excel file
    const fileName = `Expense_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    if (onExportComplete) {
      onExportComplete();
    }
  };

  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Export Expense Report
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Generate an Excel report of your expenses for accounting purposes
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={exportToExcel}
        sx={{ mt: 2 }}
      >
        Export to Excel
      </Button>
    </Box>
  );
};

export default ExportReport; 