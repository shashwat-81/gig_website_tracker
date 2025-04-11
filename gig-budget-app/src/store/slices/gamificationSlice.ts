import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Badge, Challenge, UserBadge, UserChallenge } from '../../types';

interface GamificationState {
  badges: Badge[];
  userBadges: UserBadge[];
  challenges: Challenge[];
  userChallenges: UserChallenge[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GamificationState = {
  badges: [],
  userBadges: [],
  challenges: [],
  userChallenges: [],
  isLoading: false,
  error: null
};

export const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    // Badge actions
    fetchBadgesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchBadgesSuccess: (state, action: PayloadAction<Badge[]>) => {
      state.isLoading = false;
      state.badges = action.payload;
      state.error = null;
    },
    fetchBadgesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchUserBadgesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserBadgesSuccess: (state, action: PayloadAction<UserBadge[]>) => {
      state.isLoading = false;
      state.userBadges = action.payload;
      state.error = null;
    },
    fetchUserBadgesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    awardBadgeStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    awardBadgeSuccess: (state, action: PayloadAction<UserBadge>) => {
      state.isLoading = false;
      state.userBadges.push(action.payload);
      state.error = null;
    },
    awardBadgeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Challenge actions
    fetchChallengesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchChallengesSuccess: (state, action: PayloadAction<Challenge[]>) => {
      state.isLoading = false;
      state.challenges = action.payload;
      state.error = null;
    },
    fetchChallengesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchUserChallengesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserChallengesSuccess: (state, action: PayloadAction<UserChallenge[]>) => {
      state.isLoading = false;
      state.userChallenges = action.payload;
      state.error = null;
    },
    fetchUserChallengesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    joinChallengeStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    joinChallengeSuccess: (state, action: PayloadAction<UserChallenge>) => {
      state.isLoading = false;
      state.userChallenges.push(action.payload);
      state.error = null;
    },
    joinChallengeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateChallengeProgressStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateChallengeProgressSuccess: (state, action: PayloadAction<UserChallenge>) => {
      state.isLoading = false;
      state.userChallenges = state.userChallenges.map(challenge => 
        challenge.userId === action.payload.userId && 
        challenge.challengeId === action.payload.challengeId 
          ? action.payload 
          : challenge
      );
      state.error = null;
    },
    updateChallengeProgressFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    completeChallengeStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    completeChallengeSuccess: (state, action: PayloadAction<UserChallenge>) => {
      state.isLoading = false;
      state.userChallenges = state.userChallenges.map(challenge => 
        challenge.userId === action.payload.userId && 
        challenge.challengeId === action.payload.challengeId 
          ? action.payload 
          : challenge
      );
      state.error = null;
    },
    completeChallengeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchBadgesStart,
  fetchBadgesSuccess,
  fetchBadgesFailure,
  fetchUserBadgesStart,
  fetchUserBadgesSuccess,
  fetchUserBadgesFailure,
  awardBadgeStart,
  awardBadgeSuccess,
  awardBadgeFailure,
  fetchChallengesStart,
  fetchChallengesSuccess,
  fetchChallengesFailure,
  fetchUserChallengesStart,
  fetchUserChallengesSuccess,
  fetchUserChallengesFailure,
  joinChallengeStart,
  joinChallengeSuccess,
  joinChallengeFailure,
  updateChallengeProgressStart,
  updateChallengeProgressSuccess,
  updateChallengeProgressFailure,
  completeChallengeStart,
  completeChallengeSuccess,
  completeChallengeFailure
} = gamificationSlice.actions;

export default gamificationSlice.reducer; 