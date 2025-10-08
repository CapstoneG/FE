import { API_BASE_URL } from '../config/index';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  role?: string;
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
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
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
          message: data.message || 'Login failed',
          status: response.status,
        } as ApiError;
      }

      return data;
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

  // Login and get user info
  async loginAndGetUser(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    try {
      const loginResponse = await this.login(credentials);
      console.log('Login response:', loginResponse);
      
      const token = loginResponse.data.token;
      
      if (!token) {
        throw {
          message: 'No token received from login response',
          status: 500,
        } as ApiError;
      }

      console.log('Received token:', token);
      this.setToken(token);

      const user = await this.getCurrentUser();
      
      if (!user) {
        throw {
          message: 'Failed to get user information',
          status: 500,
        } as ApiError;
      }

      return { token, user };
    } catch (error) {
      this.removeToken();
      throw error;
    }
  }

  // Register
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
        console.error('Network error during registration:', error);
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
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
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken();
      console.log('Getting current user with token:', token);
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken();
          return null;
        }
        throw {
          message: 'Failed to get user info',
          status: response.status,
        } as ApiError;
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
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
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}

export const authService = new AuthService();