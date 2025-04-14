// src/services/webSocketService.ts
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { AttackEvent } from '../types/dashboard';

interface WebSocketOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

interface SubscriptionOptions {
  topic: string;
  onMessage: (message: any) => void;
}

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: { [key: string]: any } = {};
  private baseUrl: string;
  private options: WebSocketOptions;
  private autoReconnect: boolean = true;
  private reconnectDelay: number = 5000;
  private isConnecting: boolean = false;

  constructor(baseUrl: string, options: WebSocketOptions = {}) {
    this.baseUrl = baseUrl;
    this.options = options;
  }

  public connect(): Promise<boolean> {
    if (this.client && this.client.connected) {
      return Promise.resolve(true);
    }

    if (this.isConnecting) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.client && this.client.connected) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
      });
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.client = new Client({
          webSocketFactory: () => new SockJS(this.baseUrl),
          connectHeaders: {},
          debug: (msg) => {
            console.debug('[WebSocket]', msg);
          },
          reconnectDelay: this.reconnectDelay,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000
        });

        this.client.onConnect = (frame) => {
          console.log('[WebSocket] Connected', frame);
          this.isConnecting = false;
          if (this.options.onConnect) {
            this.options.onConnect();
          }
          resolve(true);
        };

        this.client.onDisconnect = () => {
          console.log('[WebSocket] Disconnected');
          if (this.options.onDisconnect) {
            this.options.onDisconnect();
          }
        };

        this.client.onStompError = (frame) => {
          console.error('[WebSocket] Error', frame);
          if (this.options.onError) {
            this.options.onError(frame);
          }
          reject(frame);
        };

        this.client.activate();
      } catch (error) {
        console.error('[WebSocket] Connection error', error);
        this.isConnecting = false;
        if (this.options.onError) {
          this.options.onError(error);
        }
        reject(error);
      }
    });
  }

  public disconnect(): void {
    if (this.client && this.client.connected) {
      Object.keys(this.subscriptions).forEach(topic => {
        this.unsubscribe(topic);
      });
      this.client.deactivate();
      this.client = null;
    }
  }

  public subscribe(options: SubscriptionOptions): void {
    if (!this.client || !this.client.connected) {
      throw new Error('[WebSocket] Not connected');
    }

    if (this.subscriptions[options.topic]) {
      this.unsubscribe(options.topic);
    }

    this.subscriptions[options.topic] = this.client.subscribe(options.topic, message => {
      try {
        const payload = JSON.parse(message.body);
        options.onMessage(payload);
      } catch (error) {
        console.error(`[WebSocket] Error parsing message from ${options.topic}`, error);
      }
    });
  }

  public unsubscribe(topic: string): void {
    if (this.subscriptions[topic]) {
      this.subscriptions[topic].unsubscribe();
      delete this.subscriptions[topic];
    }
  }

  public isConnected(): boolean {
    return !!(this.client && this.client.connected);
  }

  // Método para enviar mensajes
  public send(destination: string, body: any): void {
    if (!this.client || !this.client.connected) {
      throw new Error('[WebSocket] Not connected');
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body)
    });
  }

  // Métodos específicos para el dashboard de seguridad
  
  // Suscribirse a eventos de ataques en tiempo real
  public subscribeToAttacks(callback: (attack: AttackEvent) => void): void {
    this.subscribe({
      topic: '/topic/security/attacks',
      onMessage: callback
    });
  }

  // Suscribirse a alertas de seguridad
  public subscribeToAlerts(callback: (alert: any) => void): void {
    this.subscribe({
      topic: '/topic/security/alerts',
      onMessage: callback
    });
  }

  // Suscribirse a actualizaciones de servicios
  public subscribeToServiceUpdates(callback: (serviceUpdate: any) => void): void {
    this.subscribe({
      topic: '/topic/security/services',
      onMessage: callback
    });
  }

  // Suscribirse a todos los temas relevantes del dashboard
  public subscribeToDashboardUpdates(options: {
    onAttack?: (attack: AttackEvent) => void;
    onAlert?: (alert: any) => void;
    onServiceUpdate?: (serviceUpdate: any) => void;
  }): void {
    if (options.onAttack) {
      this.subscribeToAttacks(options.onAttack);
    }
    
    if (options.onAlert) {
      this.subscribeToAlerts(options.onAlert);
    }
    
    if (options.onServiceUpdate) {
      this.subscribeToServiceUpdates(options.onServiceUpdate);
    }
  }
}

// Exportar una instancia singleton del servicio
const webSocketService = new WebSocketService(
  import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws',
  {
    onConnect: () => console.log('WebSocket connected successfully'),
    onDisconnect: () => console.log('WebSocket disconnected'),
    onError: (error) => console.error('WebSocket error:', error)
  }
);

export default webSocketService;