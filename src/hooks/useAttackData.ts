// src/hooks/useAttackData.ts
import { useState, useEffect } from 'react';
import { 
  AttackEvent, 
  LastEvent, 
  AttackLine, 
  ActivityData, 
  DailyStats,
  CalendarEvent,
  Service
} from '../types/dashboard';

interface UseAttackDataReturn {
  attackEvents: AttackEvent[];
  lastEvents: LastEvent[];
  attackLines: AttackLine[];
  filteredAttackLines: AttackLine[];
  activityData: ActivityData[];
  dailyStats: DailyStats;
  calendarEvents: CalendarEvent[];
  services: Service[];
  isLoading: boolean;
  loading: boolean; // Alias para isLoading
  error: Error | null;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addAttackLine: (attack: AttackEvent) => void;
  applyFilters: (filtered: AttackLine[]) => void;
  autoRefresh: boolean;
  toggleAutoRefresh: () => void;
  refreshData: () => Promise<void>;
}

export const useAttackData = (updateInterval: number = 0): UseAttackDataReturn => {
  const [attackEvents, setAttackEvents] = useState<AttackEvent[]>([]);
  const [lastEvents, setLastEvents] = useState<LastEvent[]>([]);
  const [attackLines, setAttackLines] = useState<AttackLine[]>([]);
  const [filteredAttackLines, setFilteredAttackLines] = useState<AttackLine[]>([]);
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
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Simulación de datos para desarrollo
        const mockAttackEvents = [
          {
            id: 1,
            sourceIp: "192.168.1.1",
            destinationIp: "10.0.0.1",
            attackType: "ssh",
            timestamp: new Date().toISOString(),
            sourceLat: 40.7128,
            sourceLong: -74.0060,
            destLat: 34.0522,
            destLong: -118.2437,
            countryCode: "us",
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
            destLat: 34.0522,
            destLong: -118.2437,
            countryCode: "cn",
            severity: "medium"
          }
          // Agregar más datos de prueba según sea necesario
        ];

        setAttackEvents(mockAttackEvents);
        
        // Extract the most recent events for the sidebar
        const recent = mockAttackEvents.map((attack) => ({
          ip: attack.sourceIp,
          region: getCountryName(attack.countryCode),
          time: new Date(attack.timestamp).toLocaleTimeString(),
          countryCode: attack.countryCode
        }));
        setLastEvents(recent);
        
        // Generate some sample activity data
        setActivityData([
          { month: 'Jan', attacks: 65, sources: 28 },
          { month: 'Feb', attacks: 59, sources: 25 },
          { month: 'Mar', attacks: 80, sources: 36 },
          { month: 'Apr', attacks: 81, sources: 30 },
          { month: 'May', attacks: 56, sources: 22 },
          { month: 'Jun', attacks: 55, sources: 21 },
          { month: 'Jul', attacks: 40, sources: 18 }
        ]);

        // Establecer eventos del calendario
        setCalendarEvents([
          { date: new Date(2024, 10, 1), count: 5 },
          { date: new Date(2024, 10, 3), count: 8 },
          { date: new Date(2024, 10, 5), count: 12 },
          { date: new Date(2024, 10, 8), count: 7 },
          { date: new Date(2024, 10, 15), count: 9 }
        ]);

        // Establecer servicios
        setServices([
          { name: 'DNS', status: 'ok', description: 'Domain Name System' },
          { name: 'SSH', status: 'warning', description: 'Secure Shell Protocol' },
          { name: 'VPN', status: 'error', description: 'Virtual Private Network' }
        ]);

        // Establecer estadísticas diarias
        setDailyStats({
          totalAttacks: 47,
          blockedAttacks: 42,
          criticalAlerts: 5,
          activeUsers: 22
        });

        // Inicializar las líneas de ataque de ejemplo
        const sampleAttackLines: AttackLine[] = mockAttackEvents.map(event => ({
          id: `line-${event.id}`,
          source: { lat: event.sourceLat, lng: event.sourceLong },
          destination: { lat: event.destLat, lng: event.destLong },
          timestamp: new Date(event.timestamp).getTime(),
          attackType: event.attackType,
          severity: event.severity,
          blocked: Math.random() > 0.3, // Aleatoriamente bloqueado o no
          ipAddress: event.sourceIp,
          countryCode: event.countryCode
        }));
        
        setAttackLines(sampleAttackLines);
        setFilteredAttackLines(sampleAttackLines);

      } catch (err) {
        console.error('Error loading attack data:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Efecto para actualizar las estadísticas cuando cambia la fecha seleccionada
  useEffect(() => {
    const loadDailyStats = async () => {
      try {
        // En una aplicación real, esto cargaría datos desde la API
        // Aquí simulamos datos variados según la fecha
        const day = selectedDate.getDate();
        const randomFactor = (day % 5) + 1;
        
        setDailyStats({
          totalAttacks: 45 + randomFactor * 3,
          blockedAttacks: 40 + randomFactor * 2,
          criticalAlerts: randomFactor,
          activeUsers: 20 + randomFactor
        });

      } catch (err) {
        console.error('Error loading daily stats:', err);
      }
    };

    loadDailyStats();
  }, [selectedDate]);

  // Función para añadir una línea de ataque
  const addAttackLine = (attack: AttackEvent) => {
    // Create a unique ID for this attack line
    const lineId = `attack-line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Crear la nueva línea de ataque
    const newAttackLine: AttackLine = {
      id: lineId,
      source: { lat: attack.sourceLat, lng: attack.sourceLong },
      destination: { lat: attack.destLat, lng: attack.destLong },
      timestamp: Date.now(),
      attackType: attack.attackType,
      severity: attack.severity,
      blocked: Math.random() > 0.3, // Aleatoriamente bloqueado o no
      ipAddress: attack.sourceIp,
      countryCode: attack.countryCode
    };

    // Add the new attack line
    setAttackLines(prev => [newAttackLine, ...prev]);
    
    // También actualizar las líneas filtradas (asumiendo que no hay filtros activos)
    setFilteredAttackLines(prev => [newAttackLine, ...prev]);

    // Remove the line after animation completes (3 seconds)
    setTimeout(() => {
      setAttackLines(prev => prev.filter(line => line.id !== lineId));
      setFilteredAttackLines(prev => prev.filter(line => line.id !== lineId));
    }, 3000);
  };

  // Función para aplicar filtros a las líneas de ataque
  const applyFilters = (filtered: AttackLine[]) => {
    setFilteredAttackLines(filtered);
  };
  
  // Función para alternar auto-actualización
  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };
  
  // Función para actualizar datos manualmente
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica para recargar datos desde tu API
      // Por ahora, simularemos una actualización con datos aleatorios
      
      // Simulación de un delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generar un nuevo evento de ataque aleatorio
      const newAttack: AttackEvent = {
        id: Date.now(),
        sourceIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        destinationIp: "10.0.0.1",
        attackType: ["ssh", "http", "https", "ftp", "telnet"][Math.floor(Math.random() * 5)],
        timestamp: new Date().toISOString(),
        sourceLat: (Math.random() * 170) - 85,
        sourceLong: (Math.random() * 360) - 180,
        destLat: 34.0522,
        destLong: -118.2437,
        countryCode: ["us", "cn", "ru", "de", "gb", "fr"][Math.floor(Math.random() * 6)],
        severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)]
      };
      
      // Añadir el nuevo evento
      setAttackEvents(prev => [newAttack, ...prev]);
      
      // Añadir una línea de ataque basada en el evento
      addAttackLine(newAttack);
      
      // Actualizar los últimos eventos
      const newLastEvent: LastEvent = {
        ip: newAttack.sourceIp,
        region: getCountryName(newAttack.countryCode),
        time: new Date(newAttack.timestamp).toLocaleTimeString(),
        countryCode: newAttack.countryCode
      };
      
      setLastEvents(prev => [newLastEvent, ...prev.slice(0, 4)]);
      
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Implementar auto-actualización basada en el intervalo
  useEffect(() => {
    if (!autoRefresh || updateInterval <= 0) return;
    
    const intervalId = setInterval(() => {
      refreshData();
    }, updateInterval);
    
    return () => clearInterval(intervalId);
  }, [autoRefresh, updateInterval]);

  // Function to get country name from country code
  const getCountryName = (code: string): string => {
    const countries: {[key: string]: string} = {
      'us': 'United States',
      'cn': 'China',
      'ru': 'Russia',
      'de': 'Germany',
      'uk': 'United Kingdom',
      'gb': 'United Kingdom',
      'fr': 'France',
      'jp': 'Japan',
      'br': 'Brazil',
      'in': 'India',
      'kr': 'South Korea'
    };

    return countries[code.toLowerCase()] || code;
  };

  return {
    attackEvents,
    lastEvents,
    attackLines,
    filteredAttackLines,
    activityData,
    dailyStats,
    calendarEvents,
    services,
    isLoading,
    loading: isLoading,
    error,
    selectedDate,
    setSelectedDate,
    addAttackLine,
    applyFilters,
    autoRefresh,
    toggleAutoRefresh,
    refreshData
  };
};