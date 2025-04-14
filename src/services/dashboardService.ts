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
    { ip: '69.41.3.206', region: 'USA', time: '05:31:20 pm', countryCode: 'us' },
    { ip: '69.41.3.206', region: 'USA', time: '05:30:59 pm', countryCode: 'us' },
    { ip: '69.41.3.206', region: 'USA', time: '05:30:57 pm', countryCode: 'us' },
    { ip: '69.41.3.206', region: 'USA', time: '05:30:56 pm', countryCode: 'us' },
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

// Datos mock para eventos del calendario
const MOCK_CALENDAR_EVENTS = [
  { date: new Date(2024, 10, 1), count: 5 },
  { date: new Date(2024, 10, 3), count: 8 },
  { date: new Date(2024, 10, 5), count: 12 },
  { date: new Date(2024, 10, 8), count: 7 },
  { date: new Date(2024, 10, 11), count: 4 },
  { date: new Date(2024, 10, 15), count: 9 },
  { date: new Date(2024, 10, 18), count: 6 },
  { date: new Date(2024, 10, 22), count: 10 },
  { date: new Date(2024, 10, 25), count: 3 },
  { date: new Date(2024, 10, 28), count: 7 },
];

// Mock para estadísticas diarias
const MOCK_DAILY_STATS: { [key: string]: { totalAttacks: number; blockedAttacks: number; criticalAlerts: number; activeUsers: number } } = {
  '2024-10-28': { totalAttacks: 35, blockedAttacks: 32, criticalAlerts: 3, activeUsers: 18 },
  '2024-10-29': { totalAttacks: 28, blockedAttacks: 25, criticalAlerts: 2, activeUsers: 15 },
  '2024-10-30': { totalAttacks: 42, blockedAttacks: 37, criticalAlerts: 5, activeUsers: 20 },
  '2024-10-31': { totalAttacks: 37, blockedAttacks: 33, criticalAlerts: 4, activeUsers: 17 },
  '2024-11-01': { totalAttacks: 31, blockedAttacks: 28, criticalAlerts: 2, activeUsers: 19 },
  '2024-11-02': { totalAttacks: 25, blockedAttacks: 22, criticalAlerts: 1, activeUsers: 14 },
  '2024-11-03': { totalAttacks: 18, blockedAttacks: 16, criticalAlerts: 0, activeUsers: 12 },
  '2024-11-04': { totalAttacks: 33, blockedAttacks: 30, criticalAlerts: 2, activeUsers: 16 },
  '2024-11-05': { totalAttacks: 47, blockedAttacks: 42, criticalAlerts: 5, activeUsers: 22 },
  '2024-11-06': { totalAttacks: 39, blockedAttacks: 35, criticalAlerts: 3, activeUsers: 18 },
  '2024-11-07': { totalAttacks: 28, blockedAttacks: 25, criticalAlerts: 1, activeUsers: 15 },
  '2024-11-08': { totalAttacks: 36, blockedAttacks: 32, criticalAlerts: 4, activeUsers: 17 },
  '2024-11-09': { totalAttacks: 24, blockedAttacks: 21, criticalAlerts: 1, activeUsers: 13 },
  '2024-11-10': { totalAttacks: 19, blockedAttacks: 18, criticalAlerts: 0, activeUsers: 11 },
};

// Determinar si estamos usando datos simulados
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Función para simular demora en desarrollo
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Formato de fecha para las claves en datos diarios
 */
const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

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

/**
 * Obtiene eventos para el calendario
 */
export const fetchCalendarEvents = async () => {
  if (USE_MOCK) {
    await delay(500);
    return MOCK_CALENDAR_EVENTS;
  }
  
  try {
    const response = await api.get('/security/calendar-events');
    return response.data;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas para un día específico
 */
export const fetchDailyStats = async (date: Date) => {
  if (USE_MOCK) {
    await delay(400);
    const dateKey = formatDateKey(date);
    
    // Si existe el día específico, devuelve esos datos
    if (MOCK_DAILY_STATS[dateKey]) {
      return MOCK_DAILY_STATS[dateKey];
    }
    
    // De lo contrario, generar datos aleatorios basados en la fecha
    const day = date.getDate();
    const randomFactor = (day % 5) + 1;
    
    return {
      totalAttacks: 25 + randomFactor * 3,
      blockedAttacks: 22 + randomFactor * 2,
      criticalAlerts: randomFactor > 3 ? randomFactor - 3 : 0,
      activeUsers: 12 + randomFactor
    };
  }
  
  try {
    const dateFormatted = formatDateKey(date);
    const response = await api.get(`/security/daily-stats/${dateFormatted}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching daily stats for ${date}:`, error);
    throw error;
  }
};