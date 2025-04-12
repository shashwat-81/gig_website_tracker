import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Sample notifications generator
const generateRandomNotification = (): Omit<Notification, 'id' | 'timestamp' | 'read'> => {
  const templates = [
    {
      title: 'Income Alert',
      message: 'Your income this week is 15% higher than usual. Great job!',
      type: 'success' as const
    },
    {
      title: 'Expense Warning',
      message: 'Your fuel expenses are 20% higher than last month.',
      type: 'warning' as const
    },
    {
      title: 'New Opportunity',
      message: 'High demand expected in your area this weekend. Potential earnings: ₹3000-4000.',
      type: 'info' as const
    },
    {
      title: 'Tax Reminder',
      message: 'Remember to set aside 20% of your earnings for taxes this quarter.',
      type: 'info' as const
    },
    {
      title: 'Savings Goal',
      message: 'You\'re close to reaching your emergency fund goal! Only ₹5000 to go.',
      type: 'success' as const
    },
    {
      title: 'Budget Alert',
      message: 'You\'ve exceeded your daily expense limit by ₹500.',
      type: 'error' as const
    }
  ];

  return templates[Math.floor(Math.random() * templates.length)];
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== id)
    );
  };

  // Generate random notifications periodically
  useEffect(() => {
    // Add initial notifications
    for (let i = 0; i < 3; i++) {
      const notification = generateRandomNotification();
      addNotification(notification);
    }

    // Add new notifications periodically
    const interval = setInterval(() => {
      const shouldAdd = Math.random() < 0.3; // 30% chance to add a notification
      if (shouldAdd) {
        const notification = generateRandomNotification();
        addNotification(notification);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 