import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'failed';
  category: 'daily' | 'weekly' | 'monthly' | 'custom';
  reward?: string;
  progress: number;
}

interface ChallengesContextType {
  challenges: Challenge[];
  addChallenge: (challenge: Omit<Challenge, 'id' | 'progress'>) => void;
  updateChallengeProgress: (id: string, amount: number) => void;
  completeChallenge: (id: string) => void;
}

const ChallengesContext = createContext<ChallengesContextType | undefined>(undefined);

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error('useChallenges must be used within a ChallengesProvider');
  }
  return context;
};

interface ChallengesProviderProps {
  children: ReactNode;
}

// Sample challenges
const initialChallenges: Challenge[] = [
  {
    id: '1',
    title: 'No Eating Out Challenge',
    description: 'Avoid eating out for a week and save the money',
    targetAmount: 2000,
    currentAmount: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'active',
    category: 'weekly',
    reward: 'Treat yourself to a nice home-cooked meal',
    progress: 0
  },
  {
    id: '2',
    title: 'Transportation Savings',
    description: 'Use public transport or carpool for a month',
    targetAmount: 5000,
    currentAmount: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    category: 'monthly',
    reward: 'Save for a weekend getaway',
    progress: 0
  },
  {
    id: '3',
    title: 'Daily Coffee Challenge',
    description: 'Make coffee at home instead of buying',
    targetAmount: 1500,
    currentAmount: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    category: 'monthly',
    reward: 'Invest the savings',
    progress: 0
  },
  {
    id: '4',
    title: 'Weekend Entertainment',
    description: 'Find free or low-cost entertainment options',
    targetAmount: 3000,
    currentAmount: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    category: 'monthly',
    reward: 'Plan a special activity with saved money',
    progress: 0
  }
];

export const ChallengesProvider: React.FC<ChallengesProviderProps> = ({ children }) => {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);

  const addChallenge = (challenge: Omit<Challenge, 'id' | 'progress'>) => {
    const newChallenge: Challenge = {
      ...challenge,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0
    };
    setChallenges(prev => [...prev, newChallenge]);
  };

  const updateChallengeProgress = (id: string, amount: number) => {
    setChallenges(prev =>
      prev.map(challenge => {
        if (challenge.id === id) {
          const newAmount = challenge.currentAmount + amount;
          const progress = (newAmount / challenge.targetAmount) * 100;
          return {
            ...challenge,
            currentAmount: newAmount,
            progress: Math.min(progress, 100),
            status: progress >= 100 ? 'completed' : challenge.status
          };
        }
        return challenge;
      })
    );
  };

  const completeChallenge = (id: string) => {
    setChallenges(prev =>
      prev.map(challenge =>
        challenge.id === id ? { ...challenge, status: 'completed' } : challenge
      )
    );
  };

  return (
    <ChallengesContext.Provider
      value={{
        challenges,
        addChallenge,
        updateChallengeProgress,
        completeChallenge
      }}
    >
      {children}
    </ChallengesContext.Provider>
  );
}; 