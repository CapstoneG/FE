import { API_BASE_URL } from '../config';

export interface LearningSettingsUpdate {
  dailyStudyReminder: boolean;
  reminderTime: string;
  emailNotification: boolean;
  dailyStudyMinutes: number;
  targetDaysPerWeek: number;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  level?: string;
  password?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

class UserService {
  async updateLearningSettings(settings: LearningSettingsUpdate): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/learning-settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData: ApiResponse<null> = await response.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error updating learning settings:', error);
      throw error;
    }
  }

  async updateProfile(data: UpdateUserData): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/update-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData: ApiResponse<null> = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async changePassword(data: ChangePasswordData): Promise<{ code: number; message: string }> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<null> = await response.json();
      
      // Return both code and message for proper error handling
      return { code: result.code, message: result.message };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  async deactivateAccount(): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'INACTIVE' }),
      });

      if (!response.ok) {
        const errorData: ApiResponse<null> = await response.json();
        throw new Error(errorData.message || 'Failed to deactivate account');
      }

      // Clear token after successful deactivation
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error deactivating account:', error);
      throw error;
    }
  }
}

export const userService = new UserService();