import { API_BASE_URL } from '@/config';

export interface Comment {
  id: number;
  authorId: number;
  authorName: string;
  rating: number;
  date: string;
  content: string;
  likes: number;
  liked: boolean;
  replies: Comment[];
}

export interface LessonContent {
  vocabulary?: Array<{
    word: string;
    meaning: string;
    example: string;
  }>;
  grammar?: {
    topic?: string;
    explanation?: string;
    examples?: string[];
  };
  dialogue?: Array<{
    speaker: string;
    text: string;
  }>;
  video?: {
    url?: string;
    description?: string;
    duration?: number;
  };
  quiz?: Array<{
    question: string;
    options: string[];
    answer: string;
    explanation?: string;
  }>;
  exercise?: {
    type: string;
    instruction?: string;
    questions?: Array<{
      sentence: string;
      answer: string;
    }>;
  };
}

export interface LessonData {
  id: number;
  title: string;
  type: 'video' | 'exercise' | 'quiz';
  orderIndex: number;
  duration: number;
  completed: boolean;
  exercises: any[];
  content: string; // JSON string from API
  parsedContent?: LessonContent; // Parsed content object
  studySkill: 'VOCAB' | 'GRAMMAR' | 'LISTENING' | 'READING' | 'SPEAKING' | 'WRITING';
}

/**
 * Fetch lesson by ID
 */
export const fetchLessonById = async (lessonId: number): Promise<LessonData> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/v1/lessons/${lessonId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch lesson');
  }
  
  const responseData = await response.json();
  const data = responseData.result;

  // Parse content JSON
  if (data.content) {
    data.parsedContent = JSON.parse(data.content);
  }
  
  return data;
};

/**
 * Complete lesson and save score
 */
export const completeLessonWithScore = async (lessonId: number, score: number): Promise<void> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/v1/lessons/${lessonId}/complete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ score }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete lesson');
  }
};

/**
 * Like a comment
 */
export const likeComment = async (commentId: number): Promise<void> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to like comment');
  }
};

/**
 * Unlike a comment
 */
export const unlikeComment = async (commentId: number): Promise<void> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}/like`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to unlike comment');
  }
};

/**
 * Fetch comments by lesson ID
 */
export const fetchCommentsByLessonId = async (lessonId: number): Promise<Comment[]> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/comments/lesson/${lessonId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  const data = await response.json();
  return data;
};

/**
 * Add a new comment or reply
 */
export const addComment = async (
  lessonId: number,
  content: string,
  rating: number,
  parentId: number | null = null
): Promise<Comment> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lessonId,
      parentId,
      rating,
      content,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add comment');
  }

  const data = await response.json();
  return data;
};
