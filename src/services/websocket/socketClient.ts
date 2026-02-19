import { io, Socket } from 'socket.io-client';
import { WS_CONFIG } from '@/config/notificationConfig';
import { localStorageService } from '@/services/storage/localStorage';
import { SOCKET_EVENTS, type EventHandlerMap } from './socketEvents';

class SocketClient {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, Set<(args: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = WS_CONFIG.reconnectionAttempts;
  private connectionPromise: Promise<void> | null = null;

  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      const token = localStorageService.getToken();
      
      if (!token) {
        reject(new Error('No authentication token available'));
        this.connectionPromise = null;
        return;
      }

      this.socket = io(WS_CONFIG.url, {
        ...WS_CONFIG,
        auth: { token },
        query: { token },
      });

      this.setupEventHandlers(resolve, reject);
    });

    return this.connectionPromise;
  }

  private setupEventHandlers(resolve: () => void, reject: (error: Error) => void): void {
    if (!this.socket) return;

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.connectionPromise = null;
      resolve();
      this.emitStoredEvents();
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.handleDisconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.connectionPromise = null;
      reject(new Error(error.message || 'WebSocket connection failed'));
    });

    this.socket.on(SOCKET_EVENTS.ERROR, (error) => {
      console.error('WebSocket error:', error);
      // Trigger registered error handlers
      const handlers = this.eventHandlers.get(SOCKET_EVENTS.ERROR);
      if (handlers) {
        handlers.forEach(handler => handler(error));
      }
    });

    this.socket.on(SOCKET_EVENTS.RECONNECT_ATTEMPT, (attempt) => {
      console.log(`WebSocket reconnection attempt ${attempt}`);
      this.reconnectAttempts = attempt;
    });

    this.socket.on(SOCKET_EVENTS.RECONNECT_FAILED, () => {
      console.error('WebSocket reconnection failed');
      this.connectionPromise = null;
    });

    this.socket.on(SOCKET_EVENTS.UNAUTHORIZED, () => {
      console.error('WebSocket unauthorized');
      localStorageService.clearAuth();
      this.disconnect();
      // Redirect to login handled by auth interceptor
    });
  }

  private handleDisconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.connectionPromise = null;
    }
  }

  private emitStoredEvents(): void {
    // Emit any events that were queued while disconnected
    this.processEventQueue();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionPromise = null;
    }
  }

  // Event subscription with type safety
  on<K extends keyof EventHandlerMap>(
    event: K,
    handler: EventHandlerMap[K]
  ): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    
    this.eventHandlers.get(event)!.add(handler);
    
    if (this.socket) {
      this.socket.on(event, handler as any);
    }

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  off<K extends keyof EventHandlerMap>(
    event: K,
    handler: EventHandlerMap[K]
  ): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    }

    if (this.socket) {
      this.socket.off(event, handler as any);
    }
  }

  // Emit event with acknowledgment
  emit<T = any>(event: string, data?: any, ack?: (response: T) => void): void {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected, queuing event:', event);
      // Queue event for later emission
      this.queueEvent(event, data, ack);
      return;
    }

    if (ack) {
      this.socket.emit(event, data, ack);
    } else {
      this.socket.emit(event, data);
    }
  }

  private eventQueue: Array<{ event: string; data: any; ack?: Function }> = [];

  private queueEvent(event: string, data?: any, ack?: Function): void {
    this.eventQueue.push({ event, data, ack });
    
    // Limit queue size
    if (this.eventQueue.length > 100) {
      this.eventQueue.shift();
    }
  }

  private processEventQueue(): void {
    while (this.eventQueue.length > 0 && this.socket?.connected) {
      const { event, data, ack } = this.eventQueue.shift()!;
      if (ack) {
        this.socket.emit(event, data, ack);
      } else {
        this.socket.emit(event, data);
      }
    }
  }

  // Convenience methods for common events
  onNotification(handler: EventHandlerMap['notification']): () => void {
    return this.on(SOCKET_EVENTS.NOTIFICATION, handler);
  }

  onReminder(handler: EventHandlerMap['reminder']): () => void {
    return this.on(SOCKET_EVENTS.REMINDER, handler);
  }

  onAlert(handler: EventHandlerMap['alert']): () => void {
    return this.on(SOCKET_EVENTS.ALERT, handler);
  }

  onVaccinationRecorded(handler: EventHandlerMap['vaccination:recorded']): () => void {
    return this.on(SOCKET_EVENTS.VACCINATION_RECORDED, handler);
  }

  onInventoryLowStock(handler: EventHandlerMap['inventory:low_stock']): () => void {
    return this.on(SOCKET_EVENTS.INVENTORY_LOW_STOCK, handler);
  }

  onSystemStatus(handler: EventHandlerMap['system:status']): () => void {
    return this.on(SOCKET_EVENTS.SYSTEM_STATUS, handler);
  }

  onUserOnline(handler: EventHandlerMap['user:online']): () => void {
    return this.on(SOCKET_EVENTS.USER_ONLINE, handler);
  }

  onUserOffline(handler: EventHandlerMap['user:offline']): () => void {
    return this.on(SOCKET_EVENTS.USER_OFFLINE, handler);
  }

  onChatMessage(handler: EventHandlerMap['chat:message']): () => void {
    return this.on(SOCKET_EVENTS.CHAT_MESSAGE, handler);
  }

  // Connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  // Join/leave rooms
  joinRoom(room: string): void {
    this.emit('join_room', { room });
  }

  leaveRoom(room: string): void {
    this.emit('leave_room', { room });
  }

  // Typing indicators
  startTyping(conversationId: string): void {
    this.emit(SOCKET_EVENTS.USER_TYPING, {
      conversationId,
      typing: true,
    });
  }

  stopTyping(conversationId: string): void {
    this.emit(SOCKET_EVENTS.USER_TYPING, {
      conversationId,
      typing: false,
    });
  }

  // Send message with acknowledgment
  sendMessage(
    toUserId: string,
    message: string,
    callback?: (response: { id: string; timestamp: string }) => void
  ): void {
    this.emit(SOCKET_EVENTS.CHAT_MESSAGE, {
      toUserId,
      message,
    }, callback);
  }

  // Mark message as read
  markMessageAsRead(messageId: string): void {
    this.emit(SOCKET_EVENTS.CHAT_READ, { messageId });
  }

  // Acknowledge alert
  acknowledgeAlert(alertId: string): void {
    this.emit(SOCKET_EVENTS.ALERT_ACKNOWLEDGED, { alertId });
  }

  // Subscribe to real-time updates for specific resources
  subscribeToChild(childId: string): void {
    this.joinRoom(`child:${childId}`);
  }

  unsubscribeFromChild(childId: string): void {
    this.leaveRoom(`child:${childId}`);
  }

  subscribeToFacility(facilityId: string): void {
    this.joinRoom(`facility:${facilityId}`);
  }

  unsubscribeFromFacility(facilityId: string): void {
    this.leaveRoom(`facility:${facilityId}`);
  }

  // Health check
  async ping(): Promise<number> {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.emit('ping', null, () => {
        resolve(Date.now() - start);
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        reject(new Error('Ping timeout'));
      }, 5000);
    });
  }
}

// Singleton instance
export const socketClient = new SocketClient();

// Initialize connection when authenticated
export const initSocketConnection = async (): Promise<void> => {
  try {
    await socketClient.connect();
  } catch (error) {
    console.error('Failed to initialize socket connection:', error);
  }
};

// Cleanup on logout
export const closeSocketConnection = (): void => {
  socketClient.disconnect();
};

export default socketClient;