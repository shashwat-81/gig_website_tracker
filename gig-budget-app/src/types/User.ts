export interface User {
  id: number;
  name: string;
  email: string;
  category: 'Food Delivery' | 'Cab Driver' | 'House Cleaner';
  avatar: string;
} 