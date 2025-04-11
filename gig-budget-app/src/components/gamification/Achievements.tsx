import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  LinearProgress, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  Stars as StarsIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  Savings as SavingsIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  Whatshot as WhatshotIcon
} from '@mui/icons-material';
import Grid from '../common/StyledGrid';

// Dummy achievements data
const dummyAchievements = [
  {
    id: 1,
    name: 'Savings Starter',
    description: 'Save your first ₹10,000',
    icon: <SavingsIcon />,
    progress: 100,
    completed: true,
    completedDate: '2024-03-15',
    reward: 'Bronze Badge',
    category: 'Savings',
    points: 100
  },
  {
    id: 2,
    name: 'Budget Master',
    description: 'Stay under budget for 3 consecutive months',
    icon: <AccountBalanceIcon />,
    progress: 66,
    completed: false,
    completedDate: null,
    reward: 'Silver Badge',
    category: 'Budget',
    points: 200
  },
  {
    id: 3,
    name: 'Income Accelerator',
    description: 'Increase your monthly income by 20%',
    icon: <TrendingUpIcon />,
    progress: 75,
    completed: false,
    completedDate: null,
    reward: 'Gold Badge',
    category: 'Income',
    points: 300
  },
  {
    id: 4,
    name: 'Expense Eliminator',
    description: 'Reduce monthly expenses by 15%',
    icon: <TrendingDownIcon />,
    progress: 40,
    completed: false,
    completedDate: null,
    reward: 'Silver Badge',
    category: 'Expenses',
    points: 200
  },
  {
    id: 5,
    name: 'Investment Guru',
    description: 'Make your first investment',
    icon: <TimelineIcon />,
    progress: 100,
    completed: true,
    completedDate: '2024-02-10',
    reward: 'Bronze Badge',
    category: 'Investment',
    points: 150
  },
  {
    id: 6,
    name: 'Tax Tamer',
    description: 'Optimize tax savings using all available deductions',
    icon: <AccountBalanceIcon />,
    progress: 90,
    completed: false,
    completedDate: null,
    reward: 'Gold Badge',
    category: 'Taxes',
    points: 300
  },
  {
    id: 7,
    name: 'Consistent Earner',
    description: 'Log income for 30 consecutive days',
    icon: <WhatshotIcon />,
    progress: 100,
    completed: true,
    completedDate: '2024-03-28',
    reward: 'Silver Badge',
    category: 'Income',
    points: 250
  },
  {
    id: 8,
    name: 'Emergency Fund Hero',
    description: 'Build an emergency fund worth 6 months of expenses',
    icon: <StarsIcon />,
    progress: 50,
    completed: false,
    completedDate: null,
    reward: 'Platinum Badge',
    category: 'Savings',
    points: 500
  }
];

// Dummy user stats
const userStats = {
  totalPoints: 450,
  level: 3,
  achievementsCompleted: 3,
  achievementsInProgress: 5,
  nextLevelPoints: 750
};

const Achievements: React.FC = () => {
  const [filter, setFilter] = useState<string | 'all'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<typeof dummyAchievements[0] | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Filter achievements by category
  const filteredAchievements = filter === 'all'
    ? dummyAchievements
    : dummyAchievements.filter(achievement => achievement.category === filter);

  // Get all unique categories
  const categories = Array.from(new Set(dummyAchievements.map(a => a.category)));

  // Handle viewing achievement details
  const handleViewAchievement = (achievement: typeof dummyAchievements[0]) => {
    setSelectedAchievement(achievement);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Achievements
        </Typography>
        <Chip 
          icon={<StarsIcon />} 
          label={`Level ${userStats.level} • ${userStats.totalPoints} points`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2.5, px: 1 }}
        />
      </Box>

      {/* User Progress */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your Progress
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <TrophyIcon fontSize="large" color="primary" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Level {userStats.level}</Typography>
                      <Typography>Level {userStats.level + 1}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(userStats.totalPoints / userStats.nextLevelPoints) * 100}
                      sx={{ height: 10, borderRadius: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {userStats.totalPoints} / {userStats.nextLevelPoints} points
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', height: '100%', alignItems: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {userStats.achievementsCompleted}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {userStats.achievementsInProgress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">
                    {dummyAchievements.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filter by Category
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            label="All" 
            icon={<StarsIcon />}
            onClick={() => setFilter('all')}
            color={filter === 'all' ? 'primary' : 'default'}
            variant={filter === 'all' ? 'filled' : 'outlined'}
          />
          {categories.map((category) => (
            <Chip 
              key={category}
              label={category}
              onClick={() => setFilter(category)}
              color={filter === category ? 'primary' : 'default'}
              variant={filter === category ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      {/* Achievements Grid */}
      <Typography variant="h6" gutterBottom>
        {filter === 'all' ? 'All Achievements' : `${filter} Achievements`} ({filteredAchievements.length})
      </Typography>
      <Grid container spacing={3}>
        {filteredAchievements.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                opacity: achievement.completed ? 1 : 0.9,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  cursor: 'pointer'
                }
              }}
              onClick={() => handleViewAchievement(achievement)}
            >
              {achievement.completed && (
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="Completed" 
                  color="success"
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10, 
                    zIndex: 1 
                  }}
                />
              )}
              <Box 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: achievement.completed ? 'success.light' : 'grey.100',
                  color: achievement.completed ? 'success.contrastText' : 'grey.800',
                }}
              >
                <Box sx={{ fontSize: 40, display: 'flex', justifyContent: 'center' }}>
                  {achievement.icon}
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  gutterBottom 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                  }}
                >
                  {achievement.name}
                  <Chip 
                    label={`+${achievement.points}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {achievement.description}
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {achievement.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={achievement.progress} 
                    color={achievement.completed ? "success" : "primary"}
                    sx={{ height: 6, borderRadius: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Achievement Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedAchievement && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', fontSize: 24 }}>
                {selectedAchievement.icon}
              </Box>
              {selectedAchievement.name}
            </DialogTitle>
            <DialogContent>
              <Box 
                sx={{ 
                  p: 2, 
                  mb: 2,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: selectedAchievement.completed ? 'success.light' : 'grey.100',
                  borderRadius: 1
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: 60, mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {selectedAchievement.icon}
                  </Box>
                  <Chip 
                    label={selectedAchievement.completed ? "Completed" : "In Progress"} 
                    color={selectedAchievement.completed ? "success" : "primary"}
                    icon={selectedAchievement.completed ? <CheckCircleIcon /> : <LockIcon />}
                  />
                </Box>
              </Box>
              <DialogContentText gutterBottom>
                {selectedAchievement.description}
              </DialogContentText>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Details:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Category:</Typography>
                  <Typography variant="body2">{selectedAchievement.category}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Reward:</Typography>
                  <Typography variant="body2">{selectedAchievement.reward}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Points:</Typography>
                  <Typography variant="body2">{selectedAchievement.points}</Typography>
                </Box>
                {selectedAchievement.completed && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Completed on:</Typography>
                    <Typography variant="body2">
                      {new Date(selectedAchievement.completedDate as string).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Progress</Typography>
                  <Typography variant="caption">{selectedAchievement.progress}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={selectedAchievement.progress} 
                  color={selectedAchievement.completed ? "success" : "primary"}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              {!selectedAchievement.completed && (
                <Button variant="contained" color="primary">
                  Set as Goal
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Achievements; 