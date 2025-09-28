import { useState, useEffect, createContext, useContext } from 'react';

// Types
interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  learningLevel: 'beginner' | 'intermediate' | 'advanced';
  progress: {
    completedLessons: number;
    totalPoints: number;
    streak: number;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  learningLevel: 'beginner' | 'intermediate' | 'advanced';
}

// Auth Context
export const AuthContext = createContext<AuthContextType | null>(null);

// useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Custom Hook for Authentication Logic
export const useAuthLogic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Simulate API call to verify token and get user data
          const userData = await verifyToken(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const response = await apiLogin(email, password);
      const { user: userData, token } = response;
      
      localStorage.setItem('auth_token', token);
      setUser(userData);
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const response = await apiRegister(userData);
      const { user: newUser, token } = response;
      
      localStorage.setItem('auth_token', token);
      setUser(newUser);
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      // Simulate API call
      const updatedUser = await apiUpdateProfile(user.id, data);
      setUser(updatedUser);
    } catch (error) {
      throw new Error('Profile update failed.');
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateProfile,
  };
};

// Mock API functions (replace with real API calls)
const verifyToken = async (_token: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data
  return {
    id: '1',
    email: 'user@example.com',
    username: 'learner123',
    learningLevel: 'intermediate',
    progress: {
      completedLessons: 25,
      totalPoints: 1250,
      streak: 7
    }
  };
};

const apiLogin = async (email: string, _password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock successful login
  return {
    token: 'mock_jwt_token_' + Date.now(),
    user: {
      id: '1',
      email,
      username: email.split('@')[0],
      learningLevel: 'intermediate' as const,
      progress: {
        completedLessons: 25,
        totalPoints: 1250,
        streak: 7
      }
    }
  };
};

const apiRegister = async (userData: RegisterData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    token: 'mock_jwt_token_' + Date.now(),
    user: {
      id: Date.now().toString(),
      email: userData.email,
      username: userData.username,
      learningLevel: userData.learningLevel,
      progress: {
        completedLessons: 0,
        totalPoints: 0,
        streak: 0
      }
    }
  };
};

const apiUpdateProfile = async (userId: string, data: Partial<User>): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock updated user (merge with existing data)
  return {
    id: userId,
    email: 'user@example.com',
    username: 'learner123',
    learningLevel: 'intermediate',
    progress: {
      completedLessons: 25,
      totalPoints: 1250,
      streak: 7
    },
    ...data
  } as User;
};