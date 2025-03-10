// src/services/dashboardService.ts
import api from './api';

// Datos mock para desarrollo
const MOCK_SECURITY_EVENTS = {
  events: [
    { id: 1, status: 'red', flag: 'us', ip: '23.54.12.8', country: 'United States', protocol: 'SSH', date: '2024-11-05 10:30:25', port: 22, activity: 'Failed login attempt', severity: 'High', user: 'root' },
    { id: 2, status: 'orange', flag: 'de', ip: '192.168.10.254', country: 'Germany', protocol: 'HTTP', date: '2024-11-05 10:30:40', port: 80, activity: 'Suspicious request', severity: 'Medium', user: 'admin' },
    { id: 3, status: 'green', flag: 'gb', ip: '85.105.78.32', country: 'United Kingdom', protocol: 'FTP', date: '2024-11-05 10:31:05', port: 21, activity: 'File transfer', severity: 'Low', user: 'guest' },
    { id: 4, status: 'red', flag: 'cn', ip: '203.0.113.5', country: 'China', protocol: 'Telnet', date: '2024-11-05 10:31:15', port: 23, activity: 'Brute force attack', severity: 'High', user: 'system' },
    { id: 5, status: 'red', flag: 'ru', ip: '45.76.83.43', country: 'Russia', protocol: 'SSH', date: '2024-11-05 10:31:25', port: 22, activity: 'Failed login attempt', severity: 'Critical', user: 'root' },
  ],
  lastEvents: [
    { ip: '69.41.3.206', region: 'USA', time: '05:31:20 pm' },
    { ip: '69.41.3.206', region: 'USA', time: '05:30:59 pm' },
    { ip: '69.41.3.206', region: 'USA', time: '05:30:57 pm' },
    { ip: '69.41.3.206', region: 'USA', time: '05:30:56 pm' },
  ]
};

const MOCK_ACTIVITY_DATA = [
  { month: 'Jan', attacks: 25, sources: 20 },
  { month: 'Feb', attacks: 40, sources: 30 },
  { month: 'Mar', attacks: 65, sources: 45 },
  { month: 'Apr', attacks: 50, sources: 40 },
  { month: 'May', attacks: 30, sources: 25 },
  { month: 'Jun', attacks: 45, sources: 35 },
  { month: 'Jul', attacks: 60, sources: 50 },
  { month: 'Aug', attacks: 40, sources: 35 },
  { month: 'Sep', attacks: 35, sources: 30 },
  { month: 'Oct', attacks: 50, sources: 40 },
  { month: 'Nov', attacks: 70, sources: 55 },
  { month: 'Dec', attacks: 60, sources: 50 },
];

// Determinar si estamos usando datos simulados
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Función para simular demora en desarrollo
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene los eventos de seguridad para mostrar en el dashboard
 */
export const fetchSecurityEvents = async () => {
  if (USE_MOCK) {
    await delay(800);
    return MOCK_SECURITY_EVENTS;
  }
  
  try {
    const response = await api.get('/security/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching security events:', error);
    throw error;
  }
};

/**
 * Obtiene los datos de actividad para el gráfico de líneas
 */
export const fetchActivityData = async () => {
  if (USE_MOCK) {
    await delay(600);
    return MOCK_ACTIVITY_DATA;
  }
  
  try {
    const response = await api.get('/security/activity');
    return response.data;
  } catch (error) {
    console.error('Error fetching activity data:', error);
    throw error;
  }
};

/**
 * Obtiene el estado de los servicios del sistema
 */
export const fetchServicesStatus = async () => {
  if (USE_MOCK) {
    await delay(500);
    return {
      services: [
        { name: 'DNS', status: 'ok', description: 'Domain Name System' },
        { name: 'SSH', status: 'warning', description: 'Secure Shell Protocol' },
        { name: 'VPN', status: 'error', description: 'Virtual Private Network' },
      ]
    };
  }
  
  try {
    const response = await api.get('/system/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services status:', error);
    throw error;
  }
};

/**
 * Obtiene detalles sobre un evento específico
 */
export const fetchEventDetails = async (eventId: number) => {
  if (USE_MOCK) {
    await delay(300);
    const event = MOCK_SECURITY_EVENTS.events.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    return {
      ...event,
      details: {
        source_ip_whois: 'ARIN WHOIS data indicates this IP is registered to...',
        geoip: {
          city: 'New York',
          region: 'NY',
          country: 'United States',
          loc: '40.7128,-74.0060',
          timezone: 'America/New_York'
        },
        attack_vector: 'Password spray',
        recommendation: 'Enable 2FA and review login policies'
      }
    };
  }
  
  try {
    const response = await api.get(`/security/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event details for ID ${eventId}:`, error);
    throw error;
  }
};

/**
 * Envía una acción para responder a un evento de seguridad
 */
export const respondToEvent = async (eventId: number, action: string, params?: Record<string, any>) => {
  if (USE_MOCK) {
    await delay(1000);
    return {
      success: true,
      message: `Action "${action}" applied to event #${eventId} successfully`,
      timestamp: new Date().toISOString()
    };
  }
  
  try {
    const response = await api.post(`/security/events/${eventId}/actions`, {
      action,
      ...params
    });
    return response.data;
  } catch (error) {
    console.error(`Error responding to event ID ${eventId}:`, error);
    throw error;
  }
};