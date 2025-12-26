import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {
  startStudySession,
  endStudySession,
  type StudyEventPayload,
  type ActivityType,
  type SkillType,
} from '@/services/studyService';

interface UseStudyEventsOptions {
  lessonId?: number;
  deckId?: number;
  activityType: ActivityType;
  skill: SkillType;
  autoStart?: boolean;
  autoEnd?: boolean; 
  onSessionStart?: (sessionId: number) => void;
  onSessionEnd?: () => void;
  onStatsUpdate?: (stats: StudyEventPayload) => void;
  onError?: (error: Error) => void;
}

interface UseStudyEventsReturn {
  sessionId: number | null;
  isActive: boolean;
  isConnected: boolean;
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
  error: Error | null;
}

export const useStudyEvents = ({
  lessonId,
  deckId,
  activityType,
  skill,
  autoStart = false,
  autoEnd = true,
  onSessionStart,
  onSessionEnd,
  onStatsUpdate,
  onError,
}: UseStudyEventsOptions): UseStudyEventsReturn => {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const stompClientRef = useRef<Client | null>(null);
  const hasStartedRef = useRef(false);
  const isStartingRef = useRef(false);
  const sessionIdRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);
  
  useEffect(() => {
    sessionIdRef.current = sessionId;
    isActiveRef.current = isActive;
  }, [sessionId, isActive]);

  const connectWebSocket = useCallback((userId: string) => {
    if (stompClientRef.current?.connected) {
      return;
    }

    const token = localStorage.getItem('authToken');
    
    stompClientRef.current = new Client({
      webSocketFactory: () => {
        return new SockJS(`http://localhost:8080/ws?token=${token}`);
      },
      
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      debug: (str) => {
        console.log('[Study WebSocket]', str);
      },

      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log('[Study WebSocket] Connected - ready to receive study events');
        setIsConnected(true);

        const channel = `/topic/study/${userId}`;
        console.log(`[Study WebSocket] Subscribing to: ${channel}`);

        stompClientRef.current?.subscribe(channel, (message: IMessage) => {
          try {
            const event: StudyEventPayload = JSON.parse(message.body);
            console.log('[Study WebSocket] Received event:', event);
            
            switch (event.type) {
              case 'STUDY_STARTED':
                console.log('Study session started:', event.data.sessionId);
                break;
              case 'STUDY_ENDED':
                console.log('Study session ended:', event.data.sessionId);
                break;
              case 'STATS_UPDATED':
                console.log('Study stats updated:', event.data);
                onStatsUpdate?.(event);
                break;
            }
          } catch (err) {
            console.error('[Study WebSocket] Error parsing event:', err);
          }
        });
      },

      onStompError: (frame) => {
        console.error('[Study WebSocket] Error:', frame);
        setIsConnected(false);
        const err = new Error(`WebSocket error: ${frame.headers?.message || 'Unknown error'}`);
        setError(err);
        onError?.(err);
      },

      onWebSocketClose: () => {
        console.log('[Study WebSocket] Disconnected');
        setIsConnected(false);
      },
    });

    stompClientRef.current.activate();
  }, [onStatsUpdate, onError]);

  const disconnectWebSocket = useCallback(() => {
    if (stompClientRef.current) {
      console.log('[Study WebSocket] Disconnecting...');
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const startSession = useCallback(async () => {
    if (isStartingRef.current || hasStartedRef.current) {
      console.log('[Study] Session already started or starting');
      return;
    }

    try {
      isStartingRef.current = true;
      const response = await startStudySession({
        activityType,
        skill,
        lessonId,
        deckId,
      });

      console.log('[Study] Session started:', response.sessionId);
      setSessionId(response.sessionId);
      setIsActive(true);
      hasStartedRef.current = true;
      setError(null);
      onSessionStart?.(response.sessionId);

      const userId = localStorage.getItem('userId');
      if (userId) {
        connectWebSocket(userId);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start session');
      console.error('[Study] Failed to start session:', error);
      setError(error);
      onError?.(error);
    } finally {
      isStartingRef.current = false;
    }
  }, [lessonId, deckId, activityType, skill, onSessionStart, onError, connectWebSocket]);

  const endSession = useCallback(async () => {
    if (!sessionId || !isActive) {
      console.log('[Study] No active session to end');
      return;
    }

    try {
      console.log('[Study] Ending session:', sessionId);
      await endStudySession({ sessionId });
      
      console.log('[Study] Session ended successfully');
      setIsActive(false);
      setSessionId(null);
      hasStartedRef.current = false;
      setError(null);
      onSessionEnd?.();

      disconnectWebSocket();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to end session');
      console.error('[Study] Failed to end session:', error);
      setError(error);
      onError?.(error);
    }
  }, [sessionId, isActive, onSessionEnd, onError, disconnectWebSocket]);

  useEffect(() => {
    if (autoStart && !hasStartedRef.current && !isStartingRef.current) {
      startSession();
    }
  }, [autoStart, startSession]);

  useEffect(() => {
  
    const handleBeforeUnload = () => {
      const currentSessionId = sessionIdRef.current;
      const currentIsActive = isActiveRef.current;
      
      if (currentSessionId && currentIsActive && autoEnd) {
        console.log('[Study] Page unloading - ending session:', currentSessionId);
        const token = localStorage.getItem('authToken');
        
        try {
          fetch('http://localhost:8080/api/v1/study/end', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId: currentSessionId }),
            keepalive: true,
          }).catch((err) => {
            console.error('[Study] Page unload - failed:', err);
          });
        } catch (err) {
          console.error('[Study] Page unload - error:', err);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      const currentSessionId = sessionIdRef.current;
      const currentIsActive = isActiveRef.current;
      
      if (autoEnd && currentSessionId && currentIsActive) {
        console.log('[Study] Component unmounting (navigate) - ending session:', currentSessionId);
        
        const token = localStorage.getItem('authToken');
        
        try {
          fetch('http://localhost:8080/api/v1/study/end', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId: currentSessionId }),
            keepalive: true,
          }).catch((err) => {
            console.error('[Study] Unmount - failed:', err);
          });
        } catch (err) {
          console.error('[Study] Unmount - error:', err);
        }
        
        setIsActive(false);
        setSessionId(null);
        hasStartedRef.current = false;
      }
      
      disconnectWebSocket();
    };
  }, [autoEnd, disconnectWebSocket]); 

  return {
    sessionId,
    isActive,
    isConnected,
    startSession,
    endSession,
    error,
  };
};

