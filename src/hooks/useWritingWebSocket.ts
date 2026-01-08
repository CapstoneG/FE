import { useEffect, useState, useCallback } from 'react';
import { writingWebSocketService, type WordSuggestionResponse } from '../services/writingWebSocketService';

interface UseWritingWebSocketReturn {
  connected: boolean;
  error: string | null;
  sendSuggestionRequest: (word: string) => void;
  suggestions: WordSuggestionResponse | null;
  isLoading: boolean;
}

/**
 * Custom hook để quản lý WebSocket connection cho Writing feature
 * Tự động kết nối khi component mount và ngắt kết nối khi unmount
 */
export const useWritingWebSocket = (): UseWritingWebSocketReturn => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<WordSuggestionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const connectWebSocket = async () => {
      try {
        console.log('🔌 Connecting to WebSocket...');
        await writingWebSocketService.connect();
        
        if (isMounted) {
          setConnected(true);
          setError(null);
          console.log('✅ WebSocket connected successfully');
        }

        // Đăng ký callback để nhận gợi ý từ vựng
        writingWebSocketService.onSuggestionReceived((response: WordSuggestionResponse) => {
          if (isMounted) {
            console.log('📨 Received suggestions:', response);
            setSuggestions(response);
            setIsLoading(false);
          }
        });

      } catch (err) {
        console.error('❌ Failed to connect WebSocket:', err);
        if (isMounted) {
          setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
          setConnected(false);
        }
      }
    };

    connectWebSocket();

    // Cleanup: ngắt kết nối khi component unmount
    return () => {
      isMounted = false;
      console.log('🔌 Disconnecting WebSocket...');
      writingWebSocketService.disconnect();
    };
  }, []);

  /**
   * Gửi yêu cầu gợi ý từ vựng
   */
  const sendSuggestionRequest = useCallback((word: string) => {
    if (!connected) {
      console.warn('⚠️ WebSocket is not connected');
      setError('WebSocket chưa kết nối');
      return;
    }

    if (!word || word.trim() === '') {
      console.warn('⚠️ Word cannot be empty');
      return;
    }

    setIsLoading(true);
    setSuggestions(null);
    setError(null);

    try {
      writingWebSocketService.sendWordSuggestionRequest(word.trim());
      console.log('📤 Sent word suggestion request for:', word);
    } catch (err) {
      console.error('❌ Error sending suggestion request:', err);
      setError('Có lỗi xảy ra khi gửi yêu cầu');
      setIsLoading(false);
    }
  }, [connected]);

  return {
    connected,
    error,
    sendSuggestionRequest,
    suggestions,
    isLoading
  };
};
