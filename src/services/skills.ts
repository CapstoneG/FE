import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/skills`;

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export interface WritingExerciseMetadata {
  description: string;
  prompt: string;
  wordCountMin: number;
  wordCountMax: number;
  tips: string[];
  ideaHints: string[];
  keywords: {
    word: string;
    meaning: string;
  }[];
}

export interface WritingExercise {
  id: number;
  title: string;
  level: string;
  mediaUrl: string | null;
  topic: string;
  thumbnail: string;
  skillType: string;
  metadata: WritingExerciseMetadata;
}

export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      unsorted: boolean;
      empty: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    unsorted: boolean;
    empty: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export const skillsService = {
  // Get writing exercises with pagination
  getWritingExercises: async (page: number = 0): Promise<PageableResponse<WritingExercise>> => {
    const response = await fetch(`${API_URL}/type/writing?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders().headers,
        },
      });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch writing exercises: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  },

  getListeningExercises: async (page: number = 0): Promise<PageableResponse<WritingExercise>> => {
    const response = await fetch(`${API_URL}/type/listening?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders().headers,
        },
      });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch writing exercises: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  },

  getReadingExercises: async (page: number = 0): Promise<PageableResponse<WritingExercise>> => {
    const response = await fetch(`${API_URL}/type/reading?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders().headers,
        },
      });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch writing exercises: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  },

  getSpeakingExercises: async (page: number = 0): Promise<PageableResponse<WritingExercise>> => {
    const response = await fetch(`${API_URL}/type/speaking?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders().headers,
        },
      });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch writing exercises: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  },
};
