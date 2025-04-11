import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Badge
} from '@mui/material';
import {
  EmojiEvents,
  Verified,
  Whatshot,
  Star,
  StarBorder,
  StarHalf,
  LocalOffer,
  Add
} from '@mui/icons-material';

interface Challenge {
  id: number;
  title: string;
  description: string;
  reward: string;
  target: number;
  current: number;
  difficulty: 'easy' | 'medium' | 'hard';
  deadline: Date | null;
  completed: boolean;
}

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: 'Food Budget Master',
      description: 'Keep your monthly food expenses under ₹4,000',
      reward: '₹500 savings bonus',
      target: 4000,
      current: 3200,
      difficulty: 'medium',
      deadline: new Date(2023, 6, 31),
      completed: false
    },
    {
      id: 2,
      title: 'No Impulse Purchases',
      description: 'Avoid any unplanned purchases above ₹1,000 for 30 days',
      reward: '₹750 savings bonus',
      target: 30,
      current: 22,
      difficulty: 'hard',
      deadline: new Date(2023, 6, 15),
      completed: false
    },
    {
      id: 3,
      title: 'Income Booster',
      description: 'Complete 25 gig tasks this month',
      reward: 'Premium client access',
      target: 25,
      current: 18,
      difficulty: 'medium',
      deadline: new Date(2023, 6, 30),
      completed: false
    },
    {
      id: 4,
      title: 'Emergency Fund Builder',
      description: 'Save ₹10,000 towards your emergency fund',
      reward: '10% match (₹1,000)',
      target: 10000,
      current: 6500,
      difficulty: 'hard',
      deadline: new Date(2023, 7, 31),
      completed: false
    },
    {
      id: 5,
      title: 'Bill Payment Streak',
      description: 'Pay all bills on time for 3 months straight',
      reward: 'Financial planning session',
      target: 3,
      current: 2,
      difficulty: 'easy',
      deadline: null,
      completed: false
    }
  ]);

  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([
    {
      id: 101,
      title: 'Expense Tracker',
      description: 'Log all expenses for 30 consecutive days',
      reward: '₹500 savings bonus',
      target: 30,
      current: 30,
      difficulty: 'easy',
      deadline: null,
      completed: true
    },
    {
      id: 102,
      title: 'Transportation Saver',
      description: 'Keep transportation costs under ₹2,000 for a month',
      reward: '₹300 savings bonus',
      target: 2000,
      current: 1800,
      difficulty: 'medium',
      deadline: null,
      completed: true
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [challengeProgress, setChallengeProgress] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const handleOpenProgressDialog = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setChallengeProgress(challenge.current.toString());
    setDialogOpen(true);
  };

  const handleUpdateProgress = () => {
    if (selectedChallenge && !isNaN(Number(challengeProgress))) {
      const newCurrent = Number(challengeProgress);
      
      // Update the challenge
      const updatedChallenges = challenges.map(challenge => 
        challenge.id === selectedChallenge.id 
          ? { 
              ...challenge, 
              current: newCurrent,
              completed: newCurrent >= challenge.target
            } 
          : challenge
      );
      
      // Check if the challenge is now completed
      const updatedChallenge = updatedChallenges.find(c => c.id === selectedChallenge.id);
      
      if (updatedChallenge && updatedChallenge.completed) {
        // Remove from active challenges
        const filteredChallenges = updatedChallenges.filter(c => c.id !== selectedChallenge.id);
        setChallenges(filteredChallenges);
        
        // Add to completed challenges
        setCompletedChallenges([...completedChallenges, updatedChallenge]);
      } else {
        // Just update the active challenges
        setChallenges(updatedChallenges);
      }
      
      setDialogOpen(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Star color="success" />;
      case 'medium':
        return (
          <>
            <Star color="warning" />
            <Star color="warning" />
          </>
        );
      case 'hard':
        return (
          <>
            <Star color="error" />
            <Star color="error" />
            <Star color="error" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
        Savings Challenges
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Whatshot color="error" sx={{ mr: 1 }} />
          Active Challenges
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {challenges.map((challenge) => {
            const progress = (challenge.current / challenge.target) * 100;
            const daysRemaining = challenge.deadline
              ? Math.max(0, Math.floor((challenge.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
              : null;
            
            return (
              <Box 
                key={challenge.id} 
                sx={{ 
                  width: { 
                    xs: '100%', 
                    sm: 'calc(50% - 1.5rem)', 
                    md: 'calc(33.333% - 2rem)' 
                  } 
                }}
              >
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="div" fontWeight="bold">
                        {challenge.title}
                      </Typography>
                      <Chip 
                        size="small" 
                        color={getDifficultyColor(challenge.difficulty) as any}
                        label={challenge.difficulty.toUpperCase()}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {challenge.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Progress:</span>
                        <span>
                          {typeof challenge.current === 'number' && typeof challenge.target === 'number' 
                            ? `${challenge.current.toLocaleString()} / ${challenge.target.toLocaleString()}`
                            : `${Math.round(progress)}%`
                          }
                        </span>
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(progress, 100)} 
                        sx={{ height: 8, borderRadius: 4, my: 1 }} 
                      />
                    </Box>
                    {challenge.deadline && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {daysRemaining === 0 
                            ? "Due today!" 
                            : `${daysRemaining} days remaining`}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <LocalOffer sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" color="primary">
                        Reward: {challenge.reward}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      fullWidth
                      variant="contained"
                      onClick={() => handleOpenProgressDialog(challenge)}
                    >
                      Update Progress
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            );
          })}
          {challenges.length === 0 && (
            <Box sx={{ width: '100%', textAlign: 'center', p: 4 }}>
              <Typography color="text.secondary">
                No active challenges. Create a new challenge to get started!
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <EmojiEvents color="primary" sx={{ mr: 1 }} />
          Completed Challenges
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {completedChallenges.map((challenge) => (
            <Box 
              key={challenge.id} 
              sx={{ 
                width: { 
                  xs: '100%', 
                  sm: 'calc(50% - 1.5rem)', 
                  md: 'calc(33.333% - 2rem)' 
                } 
              }}
            >
              <Card sx={{ height: '100%', opacity: 0.8 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div" fontWeight="bold">
                      {challenge.title}
                    </Typography>
                    <Badge 
                      overlap="circular"
                      badgeContent={<Verified color="primary" fontSize="small" />}
                    >
                      <Avatar sx={{ bgcolor: 'white', color: 'success.main' }}>
                        <EmojiEvents />
                      </Avatar>
                    </Badge>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {challenge.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Completed</span>
                      <span>100%</span>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={100} 
                      color="success"
                      sx={{ height: 8, borderRadius: 4, my: 1, bgcolor: 'rgba(255,255,255,0.3)' }} 
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <LocalOffer sx={{ fontSize: '1rem', mr: 1 }} />
                    <Typography variant="body2">
                      Earned: {challenge.reward}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
          {completedChallenges.length === 0 && (
            <Box sx={{ width: '100%', textAlign: 'center', p: 4 }}>
              <Typography color="text.secondary">
                You haven't completed any challenges yet.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Update Challenge Progress</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {selectedChallenge?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {selectedChallenge?.description}
            </Typography>
            <TextField
              label="Current Progress"
              type="number"
              value={challengeProgress}
              onChange={(e) => setChallengeProgress(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
              helperText={`Target: ${selectedChallenge?.target.toLocaleString()}`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateProgress} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      <Card sx={{ mt: 4, bgcolor: 'primary.dark', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Why Financial Challenges Work
          </Typography>
          <Typography variant="body2" paragraph>
            • They provide a structured path to better financial habits
          </Typography>
          <Typography variant="body2" paragraph>
            • Introducing game elements keeps you motivated and engaged
          </Typography>
          <Typography variant="body2" paragraph>
            • Regular tracking helps you stay aware of your financial choices
          </Typography>
          <Typography variant="body2">
            • Rewards reinforce positive financial behaviors
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Challenges; 