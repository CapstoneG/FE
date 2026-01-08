/**
 * Writing WebSocket Module
 * 
 * Module này cung cấp các công cụ để kết nối và giao tiếp với server
 * qua WebSocket để nhận gợi ý từ vựng real-time cho Writing feature.
 * 
 * @module writing-websocket
 */

// Export WebSocket Service
export { 
  writingWebSocketService,
  type WordSuggestionRequest,
  type WordSuggestionResponse 
} from '../services/writingWebSocketService';

// Export Custom Hook
export { useWritingWebSocket } from '../hooks/useWritingWebSocket';

/**
 * Quick Start Guide:
 * 
 * 1. Sử dụng Hook trong component:
 * ```typescript
 * import { useWritingWebSocket } from '@/lib/writing-websocket';
 * 
 * const MyComponent = () => {
 *   const { connected, sendSuggestionRequest, suggestions } = useWritingWebSocket();
 *   
 *   const handleClick = () => {
 *     sendSuggestionRequest('example');
 *   };
 *   
 *   return <div>...</div>;
 * };
 * ```
 * 
 * 2. Sử dụng Service trực tiếp:
 * ```typescript
 * import { writingWebSocketService } from '@/lib/writing-websocket';
 * 
 * // Kết nối
 * await writingWebSocketService.connect();
 * 
 * // Gửi request
 * writingWebSocketService.sendWordSuggestionRequest('word');
 * 
 * // Nhận kết quả
 * writingWebSocketService.onSuggestionReceived((response) => {
 *   console.log(response);
 * });
 * ```
 * 
 * 3. Test với Demo Component:
 * ```typescript
 * import { WritingWebSocketDemo } from '@/lib/writing-websocket';
 * 
 * function App() {
 *   return <WritingWebSocketDemo />;
 * }
 * ```
 */
