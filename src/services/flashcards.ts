import { API_BASE_URL } from '../config/index';

export interface Deck {
  id: number;
  name: string;
  description: string;
  totalCards: number;
  learnedCards: number;
  dueCards: number;
  progressPercent: number;
  sourceDeckId: number | null;
}

export interface DashboardData {
  myDecks: Deck[];
  systemDecks: Deck[];
}

export interface CreateDeckData {
  name: string;
  description: string;
}

export interface StudyCard {
  id: number;
  term: string;
  phonetic: string;
  definition: string;
  partOfSpeech: string;
  exampleSentence: string;
  deckIds: number[];
  nextReviewAt: string;
}

export interface SubmitStudyData {
  cardId: number;
  quality: number;
}

export interface DeckStudyStatsResponse {
  deckId: number;
  deckName: string;
  totalCards: number;
  learningCards: number;
  reviewCards: number;
  dueTodayCards: number;
  studiedToday: number;
  progressPercent: number;
  totalReviews: number;
  lastStudyAt: string | null;
}

export interface ApiError {
  message: string;
  status: number;
}

class FlashcardService {
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


  async getDashboard(): Promise<DashboardData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/decks/dashboard`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to fetch dashboard data',
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      if (error instanceof Error) {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
        } as ApiError;
      }
      throw {
        message: 'An unexpected error occurred',
        status: 500,
      } as ApiError;
    }
  }

  async createDeck(deckData: CreateDeckData): Promise<Deck> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/decks`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(deckData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to create deck',
          status: response.status,
        } as ApiError;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      if (error instanceof Error) {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
        } as ApiError;
      }
      throw {
        message: 'An unexpected error occurred',
        status: 500,
      } as ApiError;
    }
  }


  async deleteDeck(deckId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/decks/${deckId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Failed to delete deck',
          status: response.status,
        } as ApiError;
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }
      if (error instanceof Error) {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
        } as ApiError;
      }
      throw {
        message: 'An unexpected error occurred',
        status: 500,
      } as ApiError;
    }
  }

}

export const flashcardService = new FlashcardService();
export default flashcardService;
