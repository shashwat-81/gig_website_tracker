import { User } from '../types/User';

// Mock user data with specific categories
const USERS: User[] = [
  {
    id: 1,
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    category: 'Food Delivery',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    name: 'Priya Singh',
    email: 'priya@example.com',
    category: 'Cab Driver',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit@example.com',
    category: 'House Cleaner',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 4,
    name: 'Neha Sharma',
    email: 'neha@example.com',
    category: 'Food Delivery',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: 5,
    name: 'Vikram Desai',
    email: 'vikram@example.com',
    category: 'Cab Driver',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    id: 6,
    name: 'Lakshmi Reddy',
    email: 'lakshmi@example.com',
    category: 'House Cleaner',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
  }
];

// Mock authentication service
let currentUser: any = null;

export const getCurrentUser = () => {
  return currentUser || localStorage.getItem('user');
};

export const login = (credentials: { email: string; password: string }) => {
  // Mock login - in a real app, this would make an API call
  currentUser = { id: 1, email: credentials.email };
  localStorage.setItem('user', JSON.stringify(currentUser));
  return Promise.resolve(currentUser);
};

export const logout = () => {
  currentUser = null;
  localStorage.removeItem('user');
  return Promise.resolve();
};

// Switch to a different user (for demo purposes)
export const switchUser = (userId: number): Promise<User> => {
  return new Promise((resolve, reject) => {
    const user = USERS.find(u => u.id === userId);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      resolve(user);
    } else {
      reject(new Error('User not found'));
    }
  });
};

// Get all available users (for demo switching)
export const getAvailableUsers = (): User[] => {
  return USERS;
}; 