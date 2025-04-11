import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Fab,
  Collapse,
  Card,
  CardContent,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as RobotIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ChatWindow = styled(Card)(({ theme }) => ({
  position: 'fixed',
  bottom: 90,
  right: 20,
  width: 320,
  maxHeight: 500,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000,
}));

const MessageList = styled(List)({
  flexGrow: 1,
  overflow: 'auto',
  maxHeight: 350,
  padding: '10px',
});

const RobotAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: '8px',
  '& .MuiSvgIcon-root': {
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.1)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
}));

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FINANCE_QA = {
  'hello': 'Hi! I\'m your personal finance assistant. How can I help you today?',
  'hi': 'Hello! I\'m here to help with your financial questions.',
  'help': 'I can help you with budgeting, savings, and financial planning. What would you like to know?',
  'what is budgeting': 'Budgeting is the process of creating a plan to spend your money. It helps you track income, expenses, and ensure you\'re saving enough.',
  'how to save money': 'To save money: 1) Track your expenses 2) Create a budget 3) Cut unnecessary costs 4) Set up automatic savings 5) Look for additional income opportunities.',
  'what is emergency fund': 'An emergency fund is money set aside for unexpected expenses. It\'s recommended to save 3-6 months of living expenses.',
  'investment tips': 'Some basic investment tips: 1) Start early 2) Diversify your portfolio 3) Consider long-term goals 4) Research before investing 5) Don\'t invest money you can\'t afford to lose.',
  'credit score': 'A credit score is a number that represents your creditworthiness. Maintain a good score by paying bills on time and keeping credit utilization low.',
  'retirement planning': 'Start retirement planning early by: 1) Contributing to retirement accounts 2) Taking advantage of employer matching 3) Diversifying investments 4) Increasing savings over time.',
};

const FinanceBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your AI financial assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Generate bot response
    setTimeout(() => {
      const botResponse = generateResponse(input.toLowerCase());
      const botMessage: Message = {
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const generateResponse = (query: string): string => {
    // Check for exact matches
    for (const [key, value] of Object.entries(FINANCE_QA)) {
      if (query.includes(key)) {
        return value;
      }
    }

    // Default response if no match found
    return "I'm not sure about that. Try asking about budgeting, saving money, emergency funds, investments, credit scores, or retirement planning.";
  };

  return (
    <>
      <StyledFab color="primary" onClick={() => setIsOpen(!isOpen)}>
        <RobotIcon />
      </StyledFab>

      <Collapse in={isOpen}>
        <ChatWindow>
          <CardContent sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RobotAvatar>
                <RobotIcon />
              </RobotAvatar>
              <Typography variant="h6">Finance Bot</Typography>
            </Box>
            <IconButton size="small" onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </CardContent>

          <MessageList>
            {messages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <ListItemAvatar>
                  {message.sender === 'bot' ? (
                    <RobotAvatar>
                      <RobotIcon />
                    </RobotAvatar>
                  ) : (
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1,
                        bgcolor: message.sender === 'bot' ? 'primary.light' : 'grey.100',
                        maxWidth: '80%',
                        display: 'inline-block',
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                    </Paper>
                  }
                  sx={{
                    textAlign: message.sender === 'user' ? 'right' : 'left',
                  }}
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </MessageList>

          <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.12)' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask a finance question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSend}>
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </ChatWindow>
      </Collapse>
    </>
  );
};

export default FinanceBot; 