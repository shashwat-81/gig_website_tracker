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
import trainingData from '../../data/financeBotData.json';

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
  width: 300,
  maxHeight: 400,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000,
  borderRadius: '12px',
}));

const MessageList = styled(List)({
  flexGrow: 1,
  overflow: 'auto',
  maxHeight: 300,
  padding: '10px',
});

const RobotAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 40,
  height: 40,
}));

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface IntentResponse {
  patterns: string[];
  responses: string[];
}

interface DefaultResponse {
  responses: string[];
}

interface ScenarioResponse {
  input: string;
  output: string;
}

interface TrainingData {
  intentBased: {
    [key: string]: IntentResponse | DefaultResponse;
    default: DefaultResponse;
  };
  scenarioBased: ScenarioResponse[];
}

const SimpleFinanceBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your finance assistant. How can I help you with your financial planning today?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestMatch = (userInput: string): string => {
    const normalizedInput = userInput.toLowerCase().trim();
    
    // Check scenario-based responses first
    for (const scenario of trainingData.scenarioBased) {
      if (normalizedInput.includes(scenario.input.toLowerCase())) {
        return scenario.output;
      }
    }

    // Check intent-based responses
    for (const [intent, data] of Object.entries(trainingData.intentBased)) {
      if (intent === 'default') continue;
      const intentData = data as IntentResponse;
      
      // Special handling for goalPlanning intent with wildcards
      if (intent === 'goalPlanning') {
        const hasMatchingPattern = intentData.patterns.some(pattern => {
          // Convert wildcard pattern to regex
          const regexPattern = pattern.replace(/\*/g, '.*');
          const regex = new RegExp(`^${regexPattern}$`, 'i');
          return regex.test(normalizedInput);
        });
        
        if (hasMatchingPattern) {
          return intentData.responses[Math.floor(Math.random() * intentData.responses.length)];
        }
      } else if (intentData.patterns.some(pattern => normalizedInput.includes(pattern))) {
        return intentData.responses[Math.floor(Math.random() * intentData.responses.length)];
      }
    }

    // Return default response if no match found
    return trainingData.intentBased.default.responses[
      Math.floor(Math.random() * trainingData.intentBased.default.responses.length)
    ];
  };

  const handleSend = () => {
    if (input.trim()) {
      const userMessage: Message = { text: input, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      
      const botResponse = findBestMatch(input);
      const botMessage: Message = { text: botResponse, sender: 'bot' };
      
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
      }, 500);
      
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <StyledFab color="primary" onClick={() => setIsOpen(!isOpen)}>
        <RobotIcon />
      </StyledFab>

      <Collapse in={isOpen}>
        <Paper 
          elevation={3} 
          sx={{ 
            width: 400, 
            maxHeight: 600, 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            p: 2, 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <RobotIcon />
            <Typography variant="h6">Finance Assistant</Typography>
          </Box>

          <List sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            p: 2,
            bgcolor: 'background.default',
            minHeight: 400
          }}>
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
                        borderRadius: '12px',
                      }}
                    >
                      <Typography variant="body2">{message.text}</Typography>
                    </Paper>
                  }
                  sx={{
                    textAlign: message.sender === 'user' ? 'right' : 'left',
                  }}
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>

          <Box sx={{ p: 1, borderTop: '1px solid rgba(0,0,0,0.12)' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask a finance question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSend}>
                    <SendIcon />
                  </IconButton>
                ),
                sx: { borderRadius: '20px' }
              }}
            />
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default SimpleFinanceBot; 