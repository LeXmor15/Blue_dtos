// src/services/configurationService.ts
import api from './api';

// Tipos para configuración
export interface GeneralSettings {
  darkMode: boolean;
  autoUpdateEnabled: boolean;
  logLevel: string;
}

export interface SecuritySettings {
  maxRetention: number;
  require2fa: boolean;
  passwordPolicy: {
    minLength: boolean;
    requireUpper: boolean;
    requireSpecial: boolean;
  };
  ipAllowlist: string[];
}

export interface NotificationSettings {
  enabled: boolean;
  criticalThreshold: number;
  warningThreshold: number;
  groupingInterval: string;
  recipients: string[];
}

export interface IntegrationSettings {
  apiKey: string;
  webhookUrl: string;
  rateLimit: number;
  integrations: {
    slack: boolean;
    email: boolean;
    sms: boolean;
  };
}

export interface SystemConfiguration {
  general: GeneralSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  integration: IntegrationSettings;
}

// Determinar si estamos usando datos simulados
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Datos simulados para desarrollo
const MOCK_CONFIG: SystemConfiguration = {
  general: {
    darkMode: false,
    autoUpdateEnabled: true,
    logLevel: 'info'
  },
  security: {
    maxRetention: 30,
    require2fa: false,
    passwordPolicy: {
      minLength: true,
      requireUpper: true,
      requireSpecial: true
    },
    ipAllowlist: []
  },
  notifications: {
    enabled: true,
    criticalThreshold: 85,
    warningThreshold: 60,
    groupingInterval: '15 minutes',
    recipients: ['admin@example.com']
  },
  integration: {
    apiKey: '••••••••••••••••',
    webhookUrl: 'https://api.example.com/webhooks/blueagent',
    rateLimit: 60,
    integrations: {
      slack: true,
      email: true,
      sms: false
    }
  }
};

// Función para simular demora en desarrollo
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const configurationService = {
  // Obtener toda la configuración del sistema
  async getSystemConfiguration(): Promise<SystemConfiguration> {
    if (USE_MOCK) {
      await delay(500);
      return MOCK_CONFIG;
    }
    
    const response = await api.get('/system/configuration');
    return response.data;
  },
  
  // Actualizar sección general
  async updateGeneralSettings(settings: Partial<GeneralSettings>): Promise<GeneralSettings> {
    if (USE_MOCK) {
      await delay(700);
      return {...MOCK_CONFIG.general, ...settings};
    }
    
    const response = await api.put('/system/configuration/general', settings);
    return response.data;
  },
  
  // Actualizar sección de seguridad
  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
    if (USE_MOCK) {
      await delay(700);
      return {...MOCK_CONFIG.security, ...settings};
    }
    
    const response = await api.put('/system/configuration/security', settings);
    return response.data;
  },
  
  // Actualizar configuración de notificaciones
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    if (USE_MOCK) {
      await delay(700);
      return {...MOCK_CONFIG.notifications, ...settings};
    }
    
    const response = await api.put('/system/configuration/notifications', settings);
    return response.data;
  },
  
  // Actualizar integraciones
  async updateIntegrationSettings(settings: Partial<IntegrationSettings>): Promise<IntegrationSettings> {
    if (USE_MOCK) {
      await delay(700);
      return {...MOCK_CONFIG.integration, ...settings};
    }
    
    const response = await api.put('/system/configuration/integration', settings);
    return response.data;
  },
  
  // Regenerar API key
  async regenerateApiKey(): Promise<string> {
    if (USE_MOCK) {
      await delay(1000);
      return 'api_' + Math.random().toString(36).substring(2, 15);
    }
    
    const response = await api.post('/system/configuration/regenerate-api-key');
    return response.data.apiKey;
  }
};

export default configurationService;