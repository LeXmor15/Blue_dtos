// src/hooks/useWebSocket.ts
import { useState, useEffect, useCallback } from 'react';
import webSocketService from '../services/webSocketService';
import { AttackEvent } from '../types/dashboard';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  subscribeToAttacks?: boolean;
  subscribeToAlerts?: boolean;
  subscribeToServiceUpdates?: boolean;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  latestAttack: AttackEvent | null;
  latestAlert: any | null;
  latestServiceUpdate: any | null;
  error: Error | null;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    autoConnect = true,
    subscribeToAttacks = true,
    subscribeToAlerts = true,
    subscribeToServiceUpdates = true
  } = options;

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [latestAttack, setLatestAttack] = useState<AttackEvent | null>(null);
  const [latestAlert, setLatestAlert] = useState<any | null>(null);
  const [latestServiceUpdate, setLatestServiceUpdate] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    try {
      const result = await webSocketService.connect();
      setIsConnected(result);
      return result;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
  }, []);

  // Efecto para la conexión automática
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Efecto para suscripciones
  useEffect(() => {
    if (!isConnected) return;

    try {
      if (subscribeToAttacks) {
        webSocketService.subscribeToAttacks((attack) => {
          setLatestAttack(attack);
        });
      }

      if (subscribeToAlerts) {
        webSocketService.subscribeToAlerts((alert) => {
          setLatestAlert(alert);
        });
      }

      if (subscribeToServiceUpdates) {
        webSocketService.subscribeToServiceUpdates((update) => {
          setLatestServiceUpdate(update);
        });
      }
    } catch (err) {
      setError(err as Error);
    }
  }, [isConnected, subscribeToAttacks, subscribeToAlerts, subscribeToServiceUpdates]);

  return {
    isConnected,
    connect,
    disconnect,
    latestAttack,
    latestAlert,
    latestServiceUpdate,
    error
  };
};