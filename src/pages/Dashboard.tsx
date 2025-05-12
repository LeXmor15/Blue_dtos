// src/pages/Dashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  fetchSecurityEvents, 
  fetchActivityData, 
  fetchServicesStatus,
  fetchCalendarEvents,
  fetchDailyStats 
} from '../services/dashboardService';

// Importación de componentes
import TabNavigation from '../components/dashboard/TabNavigation';
import ActivityChart from '../components/dashboard/ActivityChart';
import LastEvents from '../components/dashboard/LastEvents';
import WorldMap from '../components/dashboard/WorldMap';
import DailyStats from '../components/dashboard/DailyStats';
import EventsTable from '../components/dashboard/EventsTable';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Tipos de datos
import { 
  AttackEvent,
  LastEvent,
  ActivityData,
  Service,
  AttackLine,
  CalendarEvent,
  DailyStats as DailyStatsType
} from '../types/dashboard';

// Utilidades
import { getCountryName } from '../utils/mapUtils';

const Dashboard = () => {
  // Estado para el tab activo
  const [activeTab, setActiveTab] = useState<string>('realtime');
  
  // Estados para los datos
  const [attackEvents, setAttackEvents] = useState<AttackEvent[]>([]);
  const [lastEvents, setLastEvents] = useState<LastEvent[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [attackLines, setAttackLines] = useState<AttackLine[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 10, 5)); // Nov 5, 2024
  const [dailyStats, setDailyStats] = useState<DailyStatsType>({
    totalAttacks: 0,
    blockedAttacks: 0,
    criticalAlerts: 0,
    activeUsers: 0
  });
  
  // Estado de carga
  const [isLoading, setIsLoading] = useState(true);
  
  // Referencia para el mapa
  const mapRef = useRef<SVGSVGElement>(null);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Cargar datos en paralelo
        const [eventsData, activity, servicesData, events, stats] = await Promise.all([
          fetchSecurityEvents(),
          fetchActivityData(),
          fetchServicesStatus(),
          fetchCalendarEvents(),
          fetchDailyStats(selectedDate)
        ]);
        
        // Configurar datos de ataque
        interface EventsDataEvent {
          id: number;
          ip: string;
          protocol: string;
          date: string;
          flag: string;
          status: string;
        }

        interface EventsData {
          events: EventsDataEvent[];
        }

        interface AttackDataItem {
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

                const attackData: AttackDataItem[] = eventsData.events.map((event: EventsDataEvent) => ({
                  id: event.id,
                  sourceIp: event.ip,
                  destinationIp: '192.168.1.1', // Valor predeterminado
                  attackType: event.protocol.toLowerCase(),
                  timestamp: event.date,
                  sourceLat: Math.random() * 80 - 40, // Coordenadas aleatorias
                  sourceLong: Math.random() * 360 - 180,
                  destLat: 34.0522, // Coordenadas fijas de destino
                  destLong: -118.2437,
                  countryCode: event.flag.toLowerCase(),
                  severity: event.status
                }));
        
        setAttackEvents(attackData);
        
        // Configurar últimos eventos
        interface EventsDataLastEvent {
          ip: string;
          region: string;
          time: string;
        }

        interface EventsDataResponse {
          lastEvents: EventsDataLastEvent[];
        }

        setLastEvents((eventsData as EventsDataResponse).lastEvents.map((event: EventsDataLastEvent): LastEvent => ({
          ...event,
          countryCode: 'us' // Valor predeterminado
        })));
        
        setActivityData(activity);
        setServices(servicesData.services);
        setCalendarEvents(events);
        setDailyStats(stats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Efecto para actualizar estadísticas diarias cuando cambia la fecha
  useEffect(() => {
    const loadDailyStats = async () => {
      try {
        const stats = await fetchDailyStats(selectedDate);
        setDailyStats(stats);
      } catch (error) {
        console.error('Error loading daily stats:', error);
      }
    };
    
    loadDailyStats();
  }, [selectedDate]);

  // Simulación de WebSocket para ataques periódicos
  useEffect(() => {
    const interval = setInterval(() => {
      if (attackEvents.length === 0) return;
      
      // Crear un ataque aleatorio basado en los existentes
      const randomIndex = Math.floor(Math.random() * attackEvents.length);
      const randomAttack = { ...attackEvents[randomIndex] };
      
      randomAttack.id = Math.floor(Math.random() * 1000);
      randomAttack.timestamp = new Date().toISOString();
      randomAttack.sourceLat = Math.random() * 80 - 40;
      randomAttack.sourceLong = Math.random() * 360 - 180;
      
      // Añadir línea de ataque
      addAttackLine(randomAttack);
      
      // Actualizar ataques
      setAttackEvents(prev => [randomAttack, ...prev].slice(0, 100));
      
      // Actualizar eventos recientes
      const newEvent: LastEvent = {
        ip: randomAttack.sourceIp,
        region: getCountryName(randomAttack.countryCode),
        time: new Date().toLocaleTimeString(),
        countryCode: randomAttack.countryCode
      };
      
      setLastEvents(prev => [newEvent, ...prev].slice(0, 5));
      
    }, 8000); // Cada 8 segundos
    
    return () => clearInterval(interval);
  }, [attackEvents]);

  // Función para añadir una línea de ataque
  const addAttackLine = (attack: AttackEvent) => {
    // Crear un ID único para esta línea de ataque
    const lineId = `attack-line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Añadir la nueva línea de ataque
    setAttackLines(prev => [
      ...prev, 
      {
        id: lineId,
        source: { lat: attack.sourceLat, lng: attack.sourceLong },
        destination: { lat: attack.destLat, lng: attack.destLong },
        timestamp: Date.now(),
        attackType: attack.attackType,
        severity: attack.severity,
        countryCode: attack.countryCode,
        ipAddress: attack.sourceIp
      }
    ]);

    // Eliminar la línea después de completar la animación (3 segundos)
    setTimeout(() => {
      setAttackLines(prev => prev.filter(line => line.id !== lineId));
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        {/* Tabs */}
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Daily Stats Panel - Muestra estadísticas para la fecha seleccionada */}
            <DailyStats 
              stats={dailyStats} 
              date={selectedDate}
            />
            
            {/* Mapa y Calendario lado a lado */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4" style={{ zIndex: 1 }}>
              {/* Mapa reducido en tamaño (2/3 del ancho) */}
              <div className="bg-gray-800 rounded-lg overflow-hidden w-full lg:w-2/3" style={{ zIndex: 1 }}>
                {/* World map */}
                <WorldMap attackLines={attackLines} />
                
                {/* Table */}
                <EventsTable events={attackEvents} maxRows={5} />
              </div>
              
              {/* Calendario a la derecha del mapa (1/3 del ancho) */}
              <div className="bg-white rounded-lg shadow w-full lg:w-1/3">
                <div className="calendar-container p-4 w-full max-w-full">
                  <h2 className="font-bold text-sm md:text-base mb-2">Date</h2>
                  
                  {/* Fecha grande en formato "5 nov 2024" */}
                  <div className="current-date-display text-xl font-bold mb-4">
                    {selectedDate.getDate()} {selectedDate.toLocaleString('default', { month: 'short' })} {selectedDate.getFullYear()}
                  </div>
                  
                  <div className="calendar-box">
                    <Calendar
                      onChange={(value) => {
                        // Verificar si es un array o un solo valor y manejar ambos casos
                        if (Array.isArray(value)) {
                          if (value[0]) {
                            setSelectedDate(value[0]); // Usar la primera fecha si es un array
                          }
                        } else {
                          if (value) {
                            setSelectedDate(value as Date);
                          }
                        }
                      }}
                      value={selectedDate}
                      className="custom-calendar"
                      formatShortWeekday={(locale, date) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]}
                      navigationLabel={({ date }) => ''}
                      nextLabel={<span>›</span>}
                      prevLabel={<span>‹</span>}
                    />
                  </div>
                  
                  <h2 className="font-bold text-sm md:text-base mt-4 mb-2">Services</h2>
                  
                  <div className="services-boxes">
                    {services.map((service, index) => (
                      <div key={index} className="service-box">
                        <div className={`service-icon ${service.status === 'ok' ? 'green' : service.status === 'warning' ? 'yellow' : 'red'}`}>
                          {service.status === 'ok' ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : service.status === 'warning' ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 5.5V8.5M8 11.5H8.01M3.07 13H12.93C14.03 13 14.76 11.82 14.23 10.89L9.27 2.47C8.74 1.53 7.26 1.53 6.73 2.47L1.77 10.89C1.24 11.82 1.97 13 3.07 13Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className="service-subtext">{service.description}</span>
                        <span className="service-text">{service.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom panels - Last Events y Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Last Events */}
              <LastEvents events={lastEvents} />
              
              {/* Activity */}
              <ActivityChart data={activityData} />
            </div>
          </>
        )}
      </div>
      
      {/* CSS para el calendario y animaciones */}
      <style>{`
        /* Contenedor principal */
        .calendar-container {
          background-color: #ffffff;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }

        /* Contenedor del calendario */
        .calendar-box {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-bottom: 15px;
        }

        /* Calendario personalizado */
        .custom-calendar {
          border: none !important;
          width: 100%;
          font-family: 'Inter', sans-serif;
          background-color: transparent;
        }

        /* Quitar bordes y ajustar padding */
        .react-calendar {
          border: none;
          line-height: 1.4;
        }

        /* Navegación del calendario */
        .react-calendar__navigation {
          margin-bottom: 10px;
        }

        /* Botones de navegación */
        .react-calendar__navigation button {
          background: none;
          border: none;
          color: #888;
          font-size: 24px;
          min-width: 36px;
        }

        /* Título del mes en la navegación */
        .react-calendar__navigation__label {
          font-weight: normal;
          font-size: 16px;
          color: transparent !important;
        }

        /* Cabecera días de la semana */
        .react-calendar__month-view__weekdays {
          font-size: 14px;
          color: #888;
          font-weight: normal;
          text-transform: uppercase;
          text-align: center;
        }

        .react-calendar__month-view__weekdays abbr {
          text-decoration: none;
          font-size: 12px;
        }

        /* Celdas de días */
        .react-calendar__tile {
          padding: 10px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #555;
        }

        /* Quitar bordes de foco */
        .react-calendar__tile:enabled:focus {
          background-color: transparent;
        }

        /* Días de otros meses */
        .react-calendar__month-view__days__day--neighboringMonth {
          color: #ccc;
        }

        /* Día actual */
        .react-calendar__tile--now {
          background-color: transparent !important;
          color: #fff !important;
          position: relative;
        }

        /* Día seleccionado - círculo azul */
        .react-calendar__tile--active,
        .react-calendar__tile--now {
          background-color: #3b82f6 !important;
          color: white !important;
          border-radius: 50%;
          font-weight: 500;
        }

        /* Pequeño punto rojo en el día actual (5) */
        .react-calendar__tile--now::after {
          content: "";
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background-color: #ff4d4d;
          border-radius: 50%;
        }

        /* Contenedor de servicios */
        .services-boxes {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 15px;
        }

        /* Caja de servicio */
        .service-box {
          padding: 12px 16px;
          border: 1px solid #eee;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 46px;
        }

        /* Icono de servicio */
        .service-icon {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .service-icon.green {
          background-color: #4ade80;
          color: white;
        }

        .service-icon.yellow {
          background-color: #facc15;
          color: white;
        }

        .service-icon.red {
          background-color: #ef4444;
          color: white;
        }

        /* Descripción del servicio */
        .service-subtext {
          color: #9ca3af;
          font-size: 14px;
          font-weight: 400;
          flex: 1;
          text-align: center;
        }

        /* Nombre del servicio */
        .service-text {
          color: #000000;
          font-size: 16px;
          font-weight: 600;
          text-align: right;
          min-width: 45px;
        }

        /* Estilos para el mapa Leaflet */
        .leaflet-container {
          height: 100%;
          width: 100%;
        }

        /* Animaciones para el mapa */
        .attack-line {
          animation: dashoffset 3s linear;
        }
        
        .pulse-marker {
          animation: pulse 1.5s ease-out infinite;
        }
        
        @keyframes dashoffset {
          from {
            stroke-dashoffset: 100;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Dashboard;