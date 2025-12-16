import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/authService';
import type { User as ApiUser, Role } from '../services/authService';

interface User extends ApiUser {
  level?: string | null; // User's English level from placement test (e.g., "Intermediate (B1)")
  learningLevel?: 'beginner' | 'intermediate' | 'advanced';
  progress?: {
    completedLessons: number;
    totalPoints: number;
    streak: number;
  };
  roles?: Role[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData && isMounted) {
          // Check if account is active
          if (userData.isActive === false) {
            // Logout if account is inactive
            await authService.logout();
            return;
          }
          
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
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Clear any existing user state before login
    setUser(null);
    try {
      const { user: userData } = await authService.loginAndGetUser({ email, password });
      
      // loginAndGetUser already checks if account is inactive
      // No need to check again here
      
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
      // Make sure user state is cleared on error
      setUser(null);
      setIsLoading(false);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await authService.loginWithGoogle();
      // Redirect will happen in authService.loginWithGoogle()
    } catch (error: any) {
      throw new Error(error.message || 'Google login failed.');
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
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
        firstName: userData.firstName,
        lastName: userData.lastName,
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
    loginWithGoogle,
    logout,
    register,
    updateProfile,
  };
};

