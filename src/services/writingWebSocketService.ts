import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '../config';

export interface WordSuggestionRequest {
  word: string;
}

export interface WordSuggestionResponse {
  synonyms: string[];
  explanation: string;
}

type SuggestionCallback = (response: WordSuggestionResponse) => void;

// WebSocket endpoint configuration
const WS_ENDPOINT = `${API_BASE_URL}/ws`;
const SUGGEST_DESTINATION = '/app/writing/suggest';
const SUBSCRIBE_DESTINATION = '/user/topic/suggest-words';

class WritingWebSocketService {
  private client: Client | null = null;
  private connected: boolean = false;
  private suggestionCallback: SuggestionCallback | null = null;

  /**
   * Kết nối WebSocket với server sử dụng STOMP over SockJS
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Tạo STOMP client với SockJS
        this.client = new Client({
          webSocketFactory: () => new SockJS(WS_ENDPOINT),
          connectHeaders: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          },
          // Callback khi kết nối thành công
          onConnect: () => {
            console.log('WebSocket connected successfully');
            this.connected = true;
            
            // Subscribe vào queue riêng của user để nhận gợi ý từ vựng
            this.client?.subscribe(SUBSCRIBE_DESTINATION, (message: IMessage) => {
              this.handleSuggestionMessage(message);
            });
            
            resolve();
          },
          
          // Callback khi có lỗi
          onStompError: (frame) => {
            console.error('STOMP error:', frame.headers['message']);
            console.error('Error details:', frame.body);
            this.connected = false;
            reject(new Error(frame.headers['message']));
          },
          
          // Callback khi WebSocket bị ngắt kết nối
          onWebSocketClose: () => {
            console.log('WebSocket connection closed');
            this.connected = false;
          },
          
          // Cấu hình reconnect
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          
          // Debug mode (có thể tắt trong production)
          debug: (str) => {
            console.log('STOMP debug:', str);
          }
        });

        // Kích hoạt kết nối
        this.client.activate();
        
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        reject(error);
      }
    });
  }

  /**
   * Xử lý message gợi ý từ vựng nhận được từ server
   */
  private handleSuggestionMessage(message: IMessage): void {
    try {
      const response: WordSuggestionResponse = JSON.parse(message.body);
      console.log('Received word suggestions:', response);
      
      // Gọi callback nếu đã được đăng ký
      if (this.suggestionCallback) {
        this.suggestionCallback(response);
      }
    } catch (error) {
      console.error('Error parsing suggestion message:', error);
    }
  }

  /**
   * Gửi yêu cầu gợi ý từ vựng lên server
   * @param word - Từ cần gợi ý
   */
  sendWordSuggestionRequest(word: string): void {
    if (!this.connected || !this.client) {
      console.error('WebSocket is not connected. Please connect first.');
      return;
    }

    if (!word || word.trim() === '') {
      console.warn('Word cannot be empty');
      return;
    }

    const request: WordSuggestionRequest = {
      word: word.trim()
    };

    try {
      // Gửi message đến destination /app/writing/suggest
      this.client.publish({
        destination: SUGGEST_DESTINATION,
        body: JSON.stringify(request),
        headers: {
          'content-type': 'application/json'
        }
      });
      
      console.log('Sent word suggestion request for:', word);
    } catch (error) {
      console.error('Error sending word suggestion request:', error);
    }
  }

  /**
   * Đăng ký callback để nhận kết quả gợi ý từ vựng
   * @param callback - Hàm callback sẽ được gọi khi nhận được gợi ý
   */
  onSuggestionReceived(callback: SuggestionCallback): void {
    this.suggestionCallback = callback;
  }

  /**
   * Ngắt kết nối WebSocket
   */
  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      this.suggestionCallback = null;
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Kiểm tra trạng thái kết nối
   */
  isConnected(): boolean {
    return this.connected;
  }
}

// Export singleton instance
export const writingWebSocketService = new WritingWebSocketService();
