import { API_BASE_URL } from '@/config';

/**
 * Activity types for study sessions
 */
export type ActivityType = 'LESSON' | 'EXERCISE' | 'QUIZ' | 'PRACTICE';

/**
 * Skill types for study tracking
 */
export type SkillType = 'VOCAB' | 'GRAMMAR' | 'LISTENING' | 'READING' | 'SPEAKING' | 'WRITING';

/**
 * Request payload for starting a study session
 */
export interface StartStudyRequest {
  activityType: ActivityType;
  skill: SkillType;
  lessonId: number;
}

/**
 * Response from starting a study session
 */
export interface StartStudyResponse {
  sessionId: number;
}

/**
 * Request payload for ending a study session
 */
export interface EndStudyRequest {
  sessionId: number;
}

export interface StudySessionStats {
  sessionId: number;
  userId: number;
  activityType: ActivityType;
  skill: SkillType;
  lessonId: number;
  startTime: string;
  endTime?: string;
  duration?: number;
  dailyStudyMinutes?: number;
  weeklyStudyMinutes?: number;
  totalStudyMinutes?: number;
}

/**
 * WebSocket event for study updates
 */
export interface StudyEventPayload {
  type: 'STUDY_STARTED' | 'STUDY_ENDED' | 'STATS_UPDATED';
  data: StudySessionStats;
}


export const startStudySession = async (request: StartStudyRequest): Promise<StartStudyResponse> => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}/api/v1/study/start`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to start study session');
  }

  return response.json();
};


export const endStudySession = async (request: EndStudyRequest): Promise<void> => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}/api/v1/study/end`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to end study session');
  }
};

