import { API_BASE_URL } from '../config/index';

export interface Achievement {
  achievementId: number;
  achievementName: string;
  type: 'STREAK' | 'FLASHCARD' | 'TIME';
  currentValue: number;
  targetValue: number;
  completed: boolean;
  iconUrl: string;
}

export interface AchievementsResponse {
  achievementCompleteList: Achievement[];
  achievementProgressList: Achievement[];
}

class AchievementService {
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAchievements(): Promise<AchievementsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/achievements`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  }
}

export const achievementService = new AchievementService();
export default achievementService;

