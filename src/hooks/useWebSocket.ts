import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_CONFIG, WS_EVENTS } from '@/config/notificationConfig';
import { IS_DEVELOPMENT } from '@/config/environment';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

type EventCallback = (...args: any[]) => void;

interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

interface WebSocketState {
  connected: boolean;
  connecting: boolean;
  error: Error | null;
  lastMessage: any | null;
}

export const useWebSocket = (
  options: UseWebSocketOptions = {}
) => {
  const {
    autoConnect = true,
    reconnection = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const { token, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  const socketRef = useRef<Socket | null>(null);
  const eventHandlersRef = useRef<Map<string, Set<EventCallback>>>(new Map());
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    lastMessage: null,
  });

  // Initialize connection
  const connect = useCallback(() => {
    if (!isAuthenticated || !token) {
      console.warn('Cannot connect WebSocket: Not authenticated');
      return;
    }

    if (socketRef.current?.connected) {
      return;
    }

    setState(prev => ({ ...prev, connecting: true, error: null }));

    try {
      const socket = io(WS_CONFIG.url, {
        ...WS_CONFIG,
        auth: { token },
        reconnection,
        reconnectionAttempts,
        reconnectionDelay,
        query: { token },
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setState(prev => ({
          ...prev,
          connected: true,
          connecting: false,
          error: null,
        }));
        onConnect?.();
        
        if (IS_DEVELOPMENT) {
          console.log('🔌 WebSocket connected');
        }
      });

      socket.on('disconnect', (reason) => {
        setState(prev => ({
          ...prev,
          connected: false,
          connecting: false,
        }));
        onDisconnect?.();
        
        if (IS_DEVELOPMENT) {
          console.log('🔌 WebSocket disconnected:', reason);
        }
      });

      socket.on('error', (error) => {
        setState(prev => ({ ...prev, error }));
        onError?.(error);
        
        showToast({
          type: 'error',
          message: 'WebSocket connection error',
        });
        
        if (IS_DEVELOPMENT) {
          console.error('🔌 WebSocket error:', error);
        }
      });

      socket.on('connect_error', (error) => {
        setState(prev => ({ ...prev, error }));
        
        if (IS_DEVELOPMENT) {
          console.error('🔌 WebSocket connection error:', error);
        }
      });

      // Replay stored event handlers
      eventHandlersRef.current.forEach((handlers, event) => {
        handlers.forEach(handler => {
          socket.on(event, handler);
        });
      });

    } catch (error) {
      setState(prev => ({ ...prev, connecting: false, error: error as Error }));
    }
  }, [token, isAuthenticated, reconnection, reconnectionAttempts, reconnectionDelay, onConnect, onDisconnect, onError, showToast]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setState({
        connected: false,
        connecting: false,
        error: null,
        lastMessage: null,
      });
    }
  }, []);

  // Reconnect
  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [connect, disconnect]);

  // Subscribe to event
  const on = useCallback((event: string, handler: EventCallback) => {
    if (!eventHandlersRef.current.has(event)) {
      eventHandlersRef.current.set(event, new Set());
    }
    eventHandlersRef.current.get(event)!.add(handler);

    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }

    return () => off(event, handler);
  }, []);

  // Unsubscribe from event
  const off = useCallback((event: string, handler: EventCallback) => {
    const handlers = eventHandlersRef.current.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        eventHandlersRef.current.delete(event);
      }
    }

    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  }, []);

  // Emit event
  const emit = useCallback((event: string, ...args: any[]) => {
    if (!socketRef.current?.connected) {
      showToast({
        type: 'warning',
        message: 'WebSocket not connected',
      });
      return;
    }
    socketRef.current.emit(event, ...args);
  }, [showToast]);

  // Auto-connect effect
  useEffect(() => {
    if (autoConnect && isAuthenticated) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [autoConnect, isAuthenticated, connect, disconnect]);

  // Listen for specific notification events
  const onNotification = useCallback((handler: (data: any) => void) => {
    return on(WS_EVENTS.NOTIFICATION, handler);
  }, [on]);

  const onAlert = useCallback((handler: (data: any) => void) => {
    return on(WS_EVENTS.ALERT, handler);
  }, [on]);

  const onReminder = useCallback((handler: (data: any) => void) => {
    return on(WS_EVENTS.REMINDER, handler);
  }, [on]);

  return {
    // State
    connected: state.connected,
    connecting: state.connecting,
    error: state.error,
    lastMessage: state.lastMessage,
    socket: socketRef.current,

    // Actions
    connect,
    disconnect,
    reconnect,
    emit,
    on,
    off,

    // Convenience methods
    onNotification,
    onAlert,
    onReminder,
  };
};

export default useWebSocket;