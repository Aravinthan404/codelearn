import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  progress: {
    [moduleId: string]: {
      completed: number;
      total: number;
      lessons: { [lessonId: string]: boolean };
    };
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProgress: (moduleId: string, lessonId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      name: 'Alex Developer',
      email,
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      progress: {
        html: { completed: 8, total: 12, lessons: { 'html-1': true, 'html-2': true } },
        css: { completed: 5, total: 10, lessons: { 'css-1': true } },
        javascript: { completed: 0, total: 15, lessons: {} },
        react: { completed: 0, total: 12, lessons: {} },
        apis: { completed: 0, total: 8, lessons: {} },
        nextjs: { completed: 0, total: 10, lessons: {} },
        sql: { completed: 0, total: 6, lessons: {} }
      }
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      name,
      email,
      progress: {
        html: { completed: 0, total: 12, lessons: {} },
        css: { completed: 0, total: 10, lessons: {} },
        javascript: { completed: 0, total: 15, lessons: {} },
        react: { completed: 0, total: 12, lessons: {} },
        apis: { completed: 0, total: 8, lessons: {} },
        nextjs: { completed: 0, total: 10, lessons: {} },
        sql: { completed: 0, total: 6, lessons: {} }
      }
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProgress = (moduleId: string, lessonId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      progress: {
        ...user.progress,
        [moduleId]: {
          ...user.progress[moduleId],
          lessons: {
            ...user.progress[moduleId].lessons,
            [lessonId]: true
          },
          completed: Object.keys({
            ...user.progress[moduleId].lessons,
            [lessonId]: true
          }).length
        }
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};