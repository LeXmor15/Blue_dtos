// src/types/dashboard.ts

// Estructura para coordenadas geográficas
export interface GeoCoordinate {
  lat: number;
  lng: number;
}

// Evento de ataque (datos originales de tu contexto)
export interface AttackEvent {
  id: number;
  sourceIp: string;
  destinationIp: string;
  attackType: string;
  timestamp: string;
  sourceLat: number;
  sourceLong: number;
  destLat: number;
  destLong: number;
  countryCode: string;
  severity: string;
}

// Línea de ataque visualizada en el mapa
export interface AttackLine {
  id: string;
  source: GeoCoordinate;
  destination: GeoCoordinate;
  timestamp: number;
  attackType: string;
  severity?: string;
  blocked?: boolean;
  ipAddress?: string;
  countryCode?: string;
}

// Evento reciente para la lista de últimos eventos
export interface LastEvent {
  ip: string;
  region: string;
  time: string;
  countryCode: string;
}

// Datos de actividad para gráficos
export interface ActivityData {
  month: string;
  attacks: number;
  sources: number;
}

// Estadísticas diarias
export interface DailyStats {
  totalAttacks: number;
  blockedAttacks: number;
  criticalAlerts: number;
  activeUsers: number;
}

// Evento de calendario
export interface CalendarEvent {
  date: Date;
  count: number;
}

// Servicio del sistema
export interface Service {
  name: string;
  status: 'ok' | 'warning' | 'error';
  description: string;
}

// Estadísticas de seguridad
export interface SecurityStats {
  total: number;
  blocked: number;
  critical: number;
}

// Filtros para el dashboard
export interface DashboardFilters {
  dateRange: {
    start: string;
    end: string;
  };
  attackTypes: string[];
  severityLevels: string[];
  countries: string[];
  onlyBlocked: boolean;
}