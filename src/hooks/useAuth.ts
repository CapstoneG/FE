import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/authService';
import type { User as ApiUser } from '../services/authService';

interface User extends ApiUser {
  learningLevel?: 'beginner' | 'intermediate' | 'advanced';
  progress?: {
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
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthLogic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser({
            ...userData,
            learningLevel: (userData as any).learningLevel || 'beginner',
            progress: (userData as any).progress || {
              completedLessons: 0,
              totalPoints: 0,
              streak: 0,
            },
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: userData } = await authService.loginAndGetUser({ email, password });
      
      setUser({
        ...userData,
        learningLevel: (userData as any).learningLevel || 'beginner',
        progress: (userData as any).progress || {
          completedLessons: 0,
          totalPoints: 0,
          streak: 0,
        },
      });
    } catch (error: any) {
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      await authService.register({
        email: userData.email,
        password: userData.password,
        username: userData.username,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      setUser({ ...user, ...data });
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

