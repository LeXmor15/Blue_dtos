// src/context/DashboardContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AttackEvent, 
  LastEvent, 
  ActivityData, 
  DailyStats,
  CalendarEvent,
  Service,
  AttackLine
} from '../types/dashboard';
import { getCountryName } from '../utils/mapUtils';
import * as dashboardService from '../services/dashboardService';

// Coordenadas de tu servidor (ajustar a tu ubicación real)
const SERVER_LOCATION = { lat: 40.4168, lng: -3.7038 }; // Madrid, España por defecto

interface DashboardContextType {
  attackEvents: AttackEvent[];
  lastEvents: LastEvent[];
  attackLines: AttackLine[];
  activityData: ActivityData[];
  dailyStats: DailyStats;
  calendarEvents: CalendarEvent[];
  services: Service[];
  isLoading: boolean;
  error: Error | null;
  selectedDate: Date;
  serverLocation: { lat: number, lng: number };
  setSelectedDate: (date: Date) => void;
  setServerLocation: (location: { lat: number, lng: number }) => void;
  addAttackLine: (attack: AttackEvent) => void;
  addAttackEvent: (event: AttackEvent) => void;
  refreshData: () => Promise<void>;
  simulateAttack: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [attackEvents, setAttackEvents] = useState<AttackEvent[]>([]);
  const [lastEvents, setLastEvents] = useState<LastEvent[]>([]);
  const [attackLines, setAttackLines] = useState<AttackLine[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    totalAttacks: 0,
    blockedAttacks: 0,
    criticalAlerts: 0,
    activeUsers: 0
  });
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 10, 5)); // Nov 5, 2024
  const [serverLocation, setServerLocation] = useState(SERVER_LOCATION);

  // Carga inicial de datos
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Simulación de carga de datos (en un caso real, llamaríamos a APIs)
      const mockAttackEvents = [
        {
          id: 1,
          sourceIp: "192.168.1.1",
          destinationIp: "10.0.0.1",
          attackType: "ssh",
          timestamp: new Date().toISOString(),
          sourceLat: 40.7128,
          sourceLong: -74.0060,
          destLat: serverLocation.lat,
          destLong: serverLocation.lng,
          countryCode: "USA",
          severity: "high"
        },
        {
          id: 2,
          sourceIp: "203.0.113.1",
          destinationIp: "10.0.0.2",
          attackType: "http",
          timestamp: new Date().toISOString(),
          sourceLat: 39.9042,
          sourceLong: 116.4074,
          destLat: serverLocation.lat,
          destLong: serverLocation.lng,
          countryCode: "CHN",
          severity: "medium"
        },
        {
          id: 3,
          sourceIp: "8.8.8.8",
          destinationIp: "10.0.0.3",
          attackType: "https",
          timestamp: new Date().toISOString(),
          sourceLat: 51.5074,
          sourceLong: -0.1278,
          destLat: serverLocation.lat,
          destLong: serverLocation.lng,
          countryCode: "GBR",
          severity: "low"
        },
        {
          id: 4,
          sourceIp: "176.32.103.205",
          destinationIp: "10.0.0.4",
          attackType: "ftp",
          timestamp: new Date().toISOString(),
          sourceLat: 52.5200,
          sourceLong: 13.4050,
          destLat: serverLocation.lat,
          destLong: serverLocation.lng,
          countryCode: "DEU",
          severity: "critical"
        },
        {
          id: 5,
          sourceIp: "91.108.4.136",
          destinationIp: "10.0.0.5",
          attackType: "ssh",
          timestamp: new Date().toISOString(),
          sourceLat: 55.7558,
          sourceLong: 37.6173,
          destLat: serverLocation.lat,
          destLong: serverLocation.lng,
          countryCode: "RUS",
          severity: "high"
        }
      ];

      setAttackEvents(mockAttackEvents);
      
      // Extraer eventos recientes
      const recent = mockAttackEvents.map((attack) => ({
        ip: attack.sourceIp,
        region: getCountryName(attack.countryCode),
        time: new Date(attack.timestamp).toLocaleTimeString(),
        countryCode: attack.countryCode
      }));
      setLastEvents(recent);
      
      // Inicialmente no hay líneas de ataque activas
      setAttackLines([]);
      
      // Datos de actividad
      setActivityData([
        { month: 'Jan', attacks: 65, sources: 28 },
        { month: 'Feb', attacks: 59, sources: 25 },
        { month: 'Mar', attacks: 80, sources: 36 },
        { month: 'Apr', attacks: 81, sources: 30 },
        { month: 'May', attacks: 56, sources: 22 },
        { month: 'Jun', attacks: 55, sources: 21 },
        { month: 'Jul', attacks: 40, sources: 18 }
      ]);

      // Eventos del calendario
      setCalendarEvents([
        { date: new Date(2024, 10, 1), count: 5 },
        { date: new Date(2024, 10, 3), count: 8 },
        { date: new Date(2024, 10, 5), count: 12 },
        { date: new Date(2024, 10, 8), count: 7 },
        { date: new Date(2024, 10, 15), count: 9 }
      ]);

      // Servicios
      setServices([
        { name: 'DNS', status: 'ok', description: 'Domain Name System' },
        { name: 'SSH', status: 'warning', description: 'Secure Shell Protocol' },
        { name: 'VPN', status: 'error', description: 'Virtual Private Network' }
      ]);

      // Estadísticas diarias
      setDailyStats({
        totalAttacks: 47,
        blockedAttacks: 42,
        criticalAlerts: 5,
        activeUsers: 22
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Efecto para actualizar las estadísticas cuando cambia la fecha seleccionada
  useEffect(() => {
    const loadDailyStats = async () => {
      try {
        const stats = await dashboardService.fetchDailyStats(selectedDate);
        setDailyStats(stats);
      } catch (err) {
        console.error('Error loading daily stats:', err);
      }
    };

    loadDailyStats();
  }, [selectedDate]);

  // Función para añadir una línea de ataque
  const addAttackLine = (attack: AttackEvent) => {
    const lineId = `attack-line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Verificar si es un ataque bloqueado (simulación)
    const isBlocked = Math.random() > 0.3; // 70% de probabilidad de estar bloqueado

    // Add the new attack line
    setAttackLines(prev => [
      ...prev, 
      {
        id: lineId,
        source: { lat: attack.sourceLat, lng: attack.sourceLong },
        destination: { lat: attack.destLat, lng: attack.destLong },
        timestamp: Date.now(),
        attackType: attack.attackType,
        severity: attack.severity,
        blocked: isBlocked,
        ipAddress: attack.sourceIp,
        countryCode: attack.countryCode
      }
    ]);

    // Remove the line after animation completes (variable time based on attack type)
    const animationTime = attack.attackType === 'ssh' ? 5000 : 3000; // SSH atacks stay longer
    
    setTimeout(() => {
      setAttackLines(prev => prev.filter(line => line.id !== lineId));
    }, animationTime);
  };

  // Función para añadir un nuevo evento de ataque
  const addAttackEvent = (attack: AttackEvent) => {
    // Añadir a la lista de ataques
    setAttackEvents(prev => [attack, ...prev].slice(0, 100));
    
    // Añadir a eventos recientes
    const newEvent = {
      ip: attack.sourceIp,
      region: getCountryName(attack.countryCode),
      time: new Date(attack.timestamp).toLocaleTimeString(),
      countryCode: attack.countryCode
    };
    
    setLastEvents(prev => [newEvent, ...prev].slice(0, 5));
    
    // Añadir línea de ataque
    addAttackLine(attack);
  };

  // Función para simular un ataque aleatorio
  const simulateAttack = () => {
    if (attackEvents.length === 0) return;
    
    // Seleccionar un evento aleatorio
    const randomEventIndex = Math.floor(Math.random() * attackEvents.length);
    const baseEvent = attackEvents[randomEventIndex];
    
    // Crear una pequeña variación en las coordenadas
    const latVariation = (Math.random() - 0.5) * 5;
    const lngVariation = (Math.random() - 0.5) * 5;
    
    // Crear un nuevo evento con ID único y coordenadas ligeramente diferentes
    const newEvent: AttackEvent = {
      ...baseEvent,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      sourceLat: baseEvent.sourceLat + latVariation,
      sourceLong: baseEvent.sourceLong + lngVariation
    };
    
    // Añadir el nuevo evento
    addAttackEvent(newEvent);
  };

  // Función para recargar todos los datos
  const refreshData = async () => {
    await loadData();
  };

  return (
    <DashboardContext.Provider
      value={{
        attackEvents,
        lastEvents,
        attackLines,
        activityData,
        dailyStats,
        calendarEvents,
        services,
        isLoading,
        error,
        selectedDate,
        serverLocation,
        setSelectedDate,
        setServerLocation,
        addAttackLine,
        addAttackEvent,
        refreshData,
        simulateAttack
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};