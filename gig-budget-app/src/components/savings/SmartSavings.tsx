import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  LinearProgress, 
  Button, 
  Chip, 
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Grid
} from '@mui/material';
import { 
  EmojiEvents, 
  LocalFireDepartment, 
  WorkspacePremium,
  Savings,
  CardGiftcard,
  AddCircle,
  TrendingUp,
  Done,
  Lock
} from '@mui/icons-material';

// Simulated user achievement data
const userAchievements = [
  { 
    id: 1, 
    name: 'Saving Streak', 
    description: 'Save money for 5 consecutive weeks', 
    progress: 5, 
    target: 5, 
    completed: true,
    icon: <LocalFireDepartment color="error" />,
    reward: '₹500 bonus when you reach ₹10,000 in emergency fund',
    xp: 100
  },
  { 
    id: 2, 
    name: 'Budget Master', 
    description: 'Stay under budget for 3 consecutive months', 
    progress: 2, 
    target: 3, 
    completed: false,
    icon: <WorkspacePremium color="primary" />,
    reward: 'Unlock advanced expense analytics',
    xp: 75
  },
  { 
    id: 3, 
    name: 'Emergency Ready', 
    description: 'Save 3 months of expenses in emergency fund', 
    progress: 2, 
    target: 3, 
    completed: false,
    icon: <Savings color="success" />,
    reward: 'Special tax-saving recommendations',
    xp: 150
  },
  { 
    id: 4, 
    name: 'Tax Planner', 
    description: 'Set up quarterly tax savings', 
    progress: 100, 
    target: 100, 
    completed: true,
    icon: <CardGiftcard color="secondary" />,
    reward: 'Personalized investment recommendations',
    xp: 120
  }
];

// Simulated savings challenges specific to gig workers
const savingsChallenges = [
  {
    id: 1,
    name: 'Festival Season Buffer',
    description: 'Set aside extra earnings during high season for upcoming low periods',
    target: 20000,
    current: 12000,
    deadline: '15 November 2025',
    difficulty: 'Medium',
    participants: 1243,
    reward: '5% interest bonus on completion'
  },
  {
    id: 2,
    name: 'Tax Preparation',
    description: 'Save for quarterly advance tax payments to avoid penalties',
    target: 12000,
    current: 8000,
    deadline: '20 September 2025',
    difficulty: 'Easy',
    participants: 3056,
    reward: 'Free tax consultation'
  },
  {
    id: 3,
    name: 'Equipment Upgrade',
    description: 'Save for new work equipment to increase earning potential',
    target: 30000,
    current: 5000,
    deadline: '31 December 2025',
    difficulty: 'Hard',
    participants: 567,
    reward: 'Equipment discounts from partners'
  }
];

interface SmartSavingsProps {}

const SmartSavings: React.FC<SmartSavingsProps> = () => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges'>('achievements');
  
  // Calculate user level based on XP from completed achievements
  const userXp = userAchievements.reduce((total, achievement) => {
    return total + (achievement.completed ? achievement.xp : 0);
  }, 0);
  
  const userLevel = Math.floor(userXp / 100) + 1;
  const xpForNextLevel = userLevel * 100;
  const xpProgress = (userXp % 100) / 100 * 100;
  
  // Calculate completion rate for savings goals
  const completedGoals = userAchievements.filter(a => a.completed).length;
  const totalGoals = userAchievements.length;
  const completionRate = Math.round((completedGoals / totalGoals) * 100);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Smart Savings & Challenges
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button 
              size="small"
              variant={activeTab === 'achievements' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </Button>
            <Button 
              size="small"
              variant={activeTab === 'challenges' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('challenges')}
            >
              Challenges
            </Button>
          </Stack>
        </Box>
        
        {activeTab === 'achievements' ? (
          <>
            <Box sx={{ 
              bgcolor: 'primary.light', 
              p: 2, 
              borderRadius: 2, 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Box sx={{ position: 'relative', width: 60, height: 60 }}>
                <CircularProgress 
                  variant="determinate" 
                  value={xpProgress} 
                  size={60}
                  thickness={4}
                  sx={{ color: 'primary.main' }}
                />
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <Typography variant="h6" color="primary.main">
                    {userLevel}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">
                  Saver Level {userLevel}
                </Typography>
                <Typography variant="body2" color="primary.dark">
                  {userXp} XP • {xpForNextLevel - userXp} XP to next level
                </Typography>
                <Typography variant="body2" color="primary.dark">
                  You've completed {completionRate}% of savings achievements
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Your Savings Achievements
            </Typography>
            
            <Stack spacing={2} sx={{ mb: 3 }}>
              {userAchievements.map((achievement) => (
                <Card key={achievement.id} variant="outlined" sx={{ borderColor: achievement.completed ? 'success.main' : 'divider' }}>
                  <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ mr: 1.5 }}>
                        {achievement.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2">
                            {achievement.name}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={`${achievement.xp} XP`} 
                            color={achievement.completed ? "success" : "default"}
                            sx={{ height: 20 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {achievement.description}
                        </Typography>
                      </Box>
                    </Box>
                    {!achievement.completed && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Progress: {achievement.progress}/{achievement.target}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Math.round((achievement.progress / achievement.target) * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(achievement.progress / achievement.target) * 100} 
                          sx={{ height: 5, borderRadius: 5 }}
                        />
                      </Box>
                    )}
                    {achievement.completed && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Done color="success" fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="success.main">
                          Completed! {achievement.reward}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<AddCircle />}
              >
                Browse More Achievements
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Personalized Saving Challenges
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Join other gig workers in saving for specific goals with bonus rewards
              </Typography>
              
              {savingsChallenges.map((challenge) => (
                <Card key={challenge.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {challenge.name}
                      </Typography>
                      <Chip 
                        label={challenge.difficulty} 
                        size="small" 
                        color={
                          challenge.difficulty === 'Easy' ? 'success' : 
                          challenge.difficulty === 'Medium' ? 'primary' : 'error'
                        }
                      />
                    </Box>
                    <Typography variant="body2" gutterBottom>
                      {challenge.description}
                    </Typography>
                    
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            ₹{challenge.current.toLocaleString()} of ₹{challenge.target.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Math.round((challenge.current / challenge.target) * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(challenge.current / challenge.target) * 100} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Due:</strong> {challenge.deadline}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>{challenge.participants.toLocaleString()}</strong> participants
                        </Typography>
                        <Typography variant="caption" color="primary">
                          <strong>Reward:</strong> {challenge.reward}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button size="small" variant="contained">
                        Join Challenge
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2">
                Exclusive Rewards
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available at Level {userLevel + 2}
              </Typography>
            </Box>
            
            <Card variant="outlined" sx={{ bgcolor: 'grey.100' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.6 }}>
                  <Lock sx={{ mr: 1.5, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Investment Matching Program
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get up to ₹5,000 matched when investing in tax-saving instruments
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartSavings; 