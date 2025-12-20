import { API_BASE_URL } from '../config/index';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Role {
  name: string;
}

export interface LearningSettings {
  dailyStudyReminder: boolean;
  reminderTime: string;
  emailNotification: boolean;
  dailyStudyMinutes: number;
  targetDaysPerWeek: number;
}

export interface User {
  id: string | number;
  email: string;
  username?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  avatar?: string;
  avatarUrl?: string;
  level?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  isActive?: boolean;
  status?: string; // 'ACTIVE' | 'INACTIVE'
  role?: string;
  roles?: Role[];
  provider?: 'LOCAL' | 'GOOGLE';
  learningSettings?: LearningSettings;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginResponse {
  data: {
    token: string;
  };
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.result?.message || data.message || 'Login failed',
          status: response.status,
        } as ApiError;
      }

      // Check if authentication was successful
      if (data.result && !data.result.authenticated) {
        throw {
          message: data.result.message || 'Login failed',
          status: 401,
        } as ApiError;
      }

      // Check if token exists
      if (data.result && data.result.token) {
        if (data.result.refreshToken) {
          this.setRefreshToken(data.result.refreshToken);
        }
        return data.result.token;
      }

      throw {
        message: 'Invalid response format - token not found',
        status: 500,
      } as ApiError;
    } catch (error) {
      // If it's already an ApiError object, throw it as-is
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      // If it's a network Error, wrap it
      if (error instanceof Error) {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  // Login and get user info
  async loginAndGetUser(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    try {
      const token = await this.login(credentials);
      
      if (!token) {
        throw {
          message: 'No token received from login response',
          status: 500,
        } as ApiError;
      }
      this.setToken(token);

      const user = await this.getCurrentUser();
      
      if (!user) {
        throw {
          message: 'Failed to get user information',
          status: 500,
        } as ApiError;
      }

      // Check if account is inactive (check both isActive and status fields)
      if (user.isActive === false || user.status === 'INACTIVE') {
        this.removeToken();
        throw {
          message: 'Tài khoản không hoạt động',
          status: 403,
        } as ApiError;
      }

      return { token, user };
    } catch (error) {
      this.removeToken();
      throw error;
    }
  }

  // Login with Google
  async loginWithGoogle(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google/url`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: 'Failed to get Google login URL',
          status: response.status,
        } as ApiError;
      }
      
      if (!data.url) {
        throw {
          message: 'Invalid response - URL not found',
          status: 500,
        } as ApiError;
      }

      // Redirect user đến Google OAuth URL
      window.location.href = data.url;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: 'Failed to initiate Google login',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  async exchangeGoogleCode(code: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.result?.message || data.message || 'Failed to exchange Google code for token',
          status: response.status,
        } as ApiError;
      }

      // Check if authentication was successful (for backends that return authenticated flag)
      if (data.result && !data.result.authenticated) {
        throw {
          message: data.result.message || 'Google authentication failed',
          status: 401,
        } as ApiError;
      }

      // Support both formats: data.token and data.result.token
      const token = data.result?.token || data.token;
      const refreshToken = data.result?.refreshToken || data.refreshToken;

      if (token) {
        if (refreshToken) {
          this.setRefreshToken(refreshToken);
        }
        return token;
      }

      throw {
        message: 'Invalid response format - token not found',
        status: 500,
      } as ApiError;
    } catch (error) {
      // If it's already an ApiError object, throw it as-is
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      // If it's a network Error, wrap it
      if (error instanceof Error) {
        throw {
          message: 'Network error during Google authentication',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  async handleOAuthCallback(code: string): Promise<{ token: string; user: User }> {
    try {
      if (!code) {
        throw {
          message: 'No code received from OAuth callback',
          status: 400,
        } as ApiError;
      }
      
      this.removeToken();
      
      const token = await this.exchangeGoogleCode(code);

      if (!token) {
        throw {
          message: 'Failed to get token from Google authentication',
          status: 500,
        } as ApiError;
      }

      this.setToken(token);
      const user = await this.getCurrentUser();

      if (!user) {
        throw {
          message: 'Failed to get user information after OAuth',
          status: 500,
        } as ApiError;
      }

      // Check if account is inactive (check both isActive and status fields)
      if (user.isActive === false || user.status === 'INACTIVE') {
        this.removeToken();
        throw {
          message: 'Tài khoản không hoạt động',
          status: 403,
        } as ApiError;
      }

      return { token, user };
    } catch (error) {
      this.removeToken();
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        switch (response.status) {
          case 400:
            errorMessage = data.message || 'Invalid registration data. Please check your input.';
            break;
          case 409:
            errorMessage = data.message || 'Email or username already exists.';
            break;
          case 422:
            errorMessage = data.message || 'Validation error. Please check your input.';
            break;
          default:
            errorMessage = data.message || 'Registration failed. Please try again.';
        }
        
        throw {
          message: errorMessage,
          status: response.status,
        } as ApiError;
      }

      return data;
    } catch (error) {
      if (error instanceof Error && !error.hasOwnProperty('status')) {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {

      // const user = await this.getCurrentUser();
      // const token = this.getToken();
      // if (token) {
      //   await fetch(`${API_BASE_URL}/auth/logout`, {
      //     method: 'POST',
      //     headers: {
      //       'Authorization': `Bearer ${token}`,
      //       'Content-Type': 'application/json',
      //     },
      //   });
      // }
    } catch (error) {
      // Silent fail on logout
    } finally {
      this.removeToken();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken();
      
      if (!token) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await this.refreshAccessToken();
          
          if (newToken) {
            const retryResponse = await fetch(`${API_BASE_URL}/api/users/info`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (retryResponse.ok) {
              const userData = await retryResponse.json();
              // Map avatarUrl to avatar for consistency
              if (userData.avatarUrl && !userData.avatar) {
                userData.avatar = userData.avatarUrl;
              }
              return userData;
            }
          }
          
          this.removeToken();
          throw {
            message: 'Authentication expired. Please login again.',
            status: 401,
          } as ApiError;
        }
        throw {
          message: 'Failed to get user info',
          status: response.status,
        } as ApiError;
      }

      const userData = await response.json();
      // Map avatarUrl to avatar for consistency
      if (userData.avatarUrl && !userData.avatar) {
        userData.avatar = userData.avatarUrl;
      }
      return userData;
    } catch (error) {
      if ((error as ApiError).status === 401) {
        throw error;
      }
      if (error instanceof Error) {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  // Update user level after placement test
  async updateUserLevel(level: string): Promise<User | null> {
    try {
      const token = this.getToken();
      
      if (!token) {
        throw {
          message: 'Not authenticated',
          status: 401,
        } as ApiError;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/update-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level }),
      });

      if (!response.ok) {
        throw {
          message: 'Failed to update user level',
          status: response.status,
        } as ApiError;
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.removeToken();
        return null;
      }

      if (data.result && data.result.token) {
        this.setToken(data.result.token);
        if (data.result.refreshToken) {
          this.setRefreshToken(data.result.refreshToken);
        }
        return data.result.token;
      }

      return null;
    } catch (error) {
      this.removeToken();
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}

export const authService = new AuthService();