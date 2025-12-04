// Notification Service - WebSocket for RECEIVING only + REST API for actions
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_BASE_URL = 'http://localhost:8080/api';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  readAt: string | null;
  read: boolean;
}

type NotificationCallback = (notification: Notification) => void;

class NotificationService {
  private stompClient: Client | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private listeners: NotificationCallback[] = [];
  private isConnecting = false;

  /**
   * Connect WebSocket - CHỈ ĐỂ NHẬN notification real-time
   * KHÔNG publish/send gì qua WebSocket
   */
  connect(userId: string) {
    if (this.stompClient?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    const token = localStorage.getItem('authToken');
    
    this.stompClient = new Client({
      webSocketFactory: () => {
        return new SockJS(`http://localhost:8080/ws?token=${token}`);
      },
      
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },

      debug: (str) => {
        console.log('STOMP Debug:', str);
      },

      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log('STOMP connected - ready to receive notifications');
        this.reconnectAttempts = 0;
        this.isConnecting = false;

        // Subscribe to topic where backend publishes notifications
        const channel = `/topic/notifications/${userId}`;
        console.log(`[WebSocket] Subscribing to channel: ${channel}`);

        this.stompClient?.subscribe(channel, (message: IMessage) => {
          try {
            const notification: Notification = JSON.parse(message.body);
            console.log(`[WebSocket] ✅ Received real-time notification:`, notification);
            
            // Notify all listeners
            this.listeners.forEach(callback => callback(notification));
          } catch (error) {
            console.error(`[WebSocket] Error parsing notification:`, error);
          }
        });
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        this.isConnecting = false;
      },

      onWebSocketClose: () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
          setTimeout(() => this.connect(userId), this.reconnectDelay);
        }
      }
    });

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.listeners = [];
    this.reconnectAttempts = 0;
  }

  subscribe(callback: NotificationCallback) {
    this.listeners.push(callback);
    
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }


  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('authToken');
    
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
  }

  /**
   * Lấy danh sách notifications
   */
  async getNotifications(offset: number = 0, limit: number = 20) {
    try {
      const url = `${API_BASE_URL}/notifications?offset=${offset}&limit=${limit}`;
      console.log('[NotificationService] Fetching notifications from:', url);
      
      const response = await this.fetchWithAuth(url);
      console.log('[NotificationService] Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[NotificationService] Error response:', errorText);
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }
      
      const rawData = await response.json();
      console.log('[NotificationService] Raw data from backend:', rawData);
      
      // Backend trả về Spring Data Page format:
      // { content: [...], totalElements: 6, ... }
      // Cần map sang format FE expect: { notifications: [...], unreadCount: ... }
      const notifications = rawData.content || [];
      const unreadCount = notifications.filter((n: Notification) => !n.read).length;
      
      const mappedData = {
        notifications,
        unreadCount,
        total: rawData.totalElements || 0
      };
      
      console.log('[NotificationService] Mapped data:', mappedData);
      console.log('[NotificationService] Total notifications:', notifications.length);
      console.log('[NotificationService] Unread count:', unreadCount);
      
      return mappedData;
    } catch (error) {
      console.error('[NotificationService] Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Đánh dấu notification đã đọc - REST API
   */
  async markAsRead(notificationId: string) {
    try {
      const response = await this.fetchWithAuth(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        { method: 'POST' }
      );
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      const response = await this.fetchWithAuth(
        `${API_BASE_URL}/notifications/read-all`,
        { method: 'POST' }
      );
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
