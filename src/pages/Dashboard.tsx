import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import DashboardLayout from '../components/layout/DashboardLayout';

// Types for data
interface AttackEvent {
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

interface LastEvent {
  ip: string;
  region: string;
  time: string;
  countryCode: string;
}

interface ActivityData {
  month: string;
  attacks: number;
  sources: number;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('realtime');
  const [attackEvents, setAttackEvents] = useState<AttackEvent[]>([]);
  const [lastEvents, setLastEvents] = useState<LastEvent[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attackLines, setAttackLines] = useState<any[]>([]);
  const [date, setDate] = useState(new Date(2024, 10, 5)); // Nov 5, 2024
  const mapRef = useRef<SVGSVGElement>(null);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    // Initialize data
    loadInitialData();
    
    // Setup WebSocket connection
    connectWebSocket();

    return () => {
      // Cleanup WebSocket on component unmount
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

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
    } catch (error) {
      console.error('Error loading attack data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWebSocket = () => {
    // Simulación de conexión WebSocket para desarrollo
    console.log('WebSocket connection simulated');
    
    // Simulación de recepción de ataques periódicos
    const interval = setInterval(() => {
      const mockAttack = {
        id: Math.floor(Math.random() * 1000),
        sourceIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        destinationIp: "10.0.0.1",
        attackType: ["ssh", "http", "dns"][Math.floor(Math.random() * 3)],
        timestamp: new Date().toISOString(),
        sourceLat: Math.random() * 80 - 40,
        sourceLong: Math.random() * 360 - 180,
        destLat: 34.0522,
        destLong: -118.2437,
        countryCode: ["us", "cn", "ru", "de", "uk"][Math.floor(Math.random() * 5)],
        severity: ["high", "medium", "low"][Math.floor(Math.random() * 3)]
      };
      
      // Actualizar ataques
      setAttackEvents(prev => [mockAttack, ...prev].slice(0, 100));
      
      // Actualizar eventos recientes
      const newEvent = {
        ip: mockAttack.sourceIp,
        region: getCountryName(mockAttack.countryCode),
        time: new Date(mockAttack.timestamp).toLocaleTimeString(),
        countryCode: mockAttack.countryCode
      };
      
      setLastEvents(prev => [newEvent, ...prev].slice(0, 5));
      
      // Añadir línea de ataque
      addAttackLine(mockAttack);
      
    }, 5000); // Cada 5 segundos
    
    return () => clearInterval(interval);
  };

  const addAttackLine = (attack: AttackEvent) => {
    // Create a unique ID for this attack line
    const lineId = `attack-line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Add the new attack line
    setAttackLines(prev => [
      ...prev, 
      {
        id: lineId,
        source: { lat: attack.sourceLat, lng: attack.sourceLong },
        destination: { lat: attack.destLat, lng: attack.destLong },
        timestamp: Date.now(),
        attackType: attack.attackType
      }
    ]);
    
    // Remove the line after animation completes (3 seconds)
    setTimeout(() => {
      setAttackLines(prev => prev.filter(line => line.id !== lineId));
    }, 3000);
  };

  // Function to get country name from country code
  const getCountryName = (code: string): string => {
    const countries: {[key: string]: string} = {
      'us': 'United States',
      'cn': 'China',
      'ru': 'Russia',
      'de': 'Germany',
      'uk': 'United Kingdom',
      'fr': 'France',
      'jp': 'Japan',
      'br': 'Brazil',
      'in': 'India',
      'kr': 'South Korea'
    };
    
    return countries[code.toLowerCase()] || code;
  };

  // Function to get flag emoji based on country code
  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode) return '🌐';
    
    // Convert country code to uppercase
    const codePoints = Array.from(countryCode.toUpperCase())
      .map(char => 127397 + char.charCodeAt(0));
    
    // Create flag emoji from regional indicator symbols
    return String.fromCodePoint(...codePoints);
  };

  // Function to get severity class
  const getSeverityClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'red':
        return 'bg-red-500';
      case 'medium':
      case 'orange':
        return 'bg-orange-500';
      case 'low':
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        {/* Tabs */}
        <div className="mb-4">
          <div className="border-b border-gray-200">
            <ul className="flex">
              <li className="mr-1">
                <button
                  className={`py-2 px-4 text-sm font-medium ${activeTab === 'realtime' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('realtime')}
                >
                  Real Time
                </button>
              </li>
              <li className="mr-1">
                <button
                  className={`py-2 px-4 text-sm font-medium ${activeTab === 'alerts' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('alerts')}
                >
                  Alerts
                </button>
              </li>
              <li className="mr-1">
                <button
                  className={`py-2 px-4 text-sm font-medium ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('reports')}
                >
                  Reports
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Mapa y Calendario lado a lado */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Mapa reducido en tamaño (2/3 del ancho) */}
              <div className="bg-gray-800 rounded-lg overflow-hidden w-full lg:w-2/3">
                {/* World map */}
                <div className="h-[200px] md:h-[250px] relative bg-gray-900">
                  {/* SVG World Map */}
                  <svg 
                    ref={mapRef}
                    className="w-full h-full" 
                    viewBox="0 0 960 500" 
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* World map background - simplified representation */}
                    <g className="countries">
                      {/* This would be your actual world map SVG paths */}
                      <path 
                        d="M473,126 L510,126 L510,150 L473,150 Z" 
                        fill="#2C3E50" 
                        stroke="#1e293b" 
                        strokeWidth="0.5"
                        data-country="us"
                      />
                      {/* More country paths would go here */}
                    </g>
                    
                    {/* Attack lines */}
                    {attackLines.map(line => (
                      <g key={line.id} className="attack-line">
                        <line 
                          x1={line.source.lng * 2.6667 + 480} 
                          y1={250 - line.source.lat * 2.7778} 
                          x2={line.destination.lng * 2.6667 + 480} 
                          y2={250 - line.destination.lat * 2.7778}
                          stroke={line.attackType === 'ssh' ? '#ff4500' : 
                                 line.attackType === 'http' ? '#4682b4' : '#ffa500'}
                          strokeWidth="1.5"
                          strokeDasharray="5,3"
                          className="animated-line"
                        />
                        <circle 
                          cx={line.source.lng * 2.6667 + 480} 
                          cy={250 - line.source.lat * 2.7778} 
                          r="3"
                          fill={line.attackType === 'ssh' ? '#ff4500' : 
                               line.attackType === 'http' ? '#4682b4' : '#ffa500'}
                          className="origin-pulse"
                        />
                      </g>
                    ))}
                  </svg>
                  
                  {/* Controls */}
                  <div className="absolute top-2 left-2 flex space-x-1">
                    <button className="bg-white text-black text-xs p-1 rounded">+</button>
                    <button className="bg-white text-black text-xs p-1 rounded">-</button>
                  </div>
                  
                  {/* Legend */}
                  <div className="absolute bottom-2 right-2 bg-gray-900 bg-opacity-70 text-white p-2 rounded text-xs">
                    <div className="flex items-center mb-1">
                      <span className="inline-block w-3 h-3 mr-2 bg-red-500"></span>
                      <span>SSH Attacks</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="inline-block w-3 h-3 mr-2 bg-blue-500"></span>
                      <span>HTTP Attacks</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 mr-2 bg-orange-500"></span>
                      <span>Other Attacks</span>
                    </div>
                  </div>
                </div>
                
                {/* Table */}
                <div className="p-2 overflow-x-auto">
                  <div className="min-w-[640px]">
                    <div className="grid grid-cols-6 gap-1 text-xs text-white">
                      <div className="p-1 font-medium">Severity</div>
                      <div className="p-1 font-medium">Source</div>
                      <div className="p-1 font-medium hidden sm:block">Target</div>
                      <div className="p-1 font-medium hidden sm:block">Protocol</div>
                      <div className="p-1 font-medium">Timestamp</div>
                      <div className="p-1 font-medium">Type</div>
                      
                      {attackEvents.slice(0, 5).map((event) => (
                        <React.Fragment key={event.id}>
                          <div className="p-1 flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${getSeverityClass(event.severity)}`}></div>
                          </div>
                          <div className="p-1 flex items-center text-xs md:text-sm">
                            <span className="mr-2">{getFlagEmoji(event.countryCode)}</span>
                            <span className="truncate">{event.sourceIp}</span>
                          </div>
                          <div className="p-1 flex items-center hidden sm:flex">
                            <span className="mr-2">🇳🇱</span>
                            <span className="truncate">{event.destinationIp}</span>
                          </div>
                          <div className="p-1 hidden sm:block">{event.attackType}</div>
                          <div className="p-1 text-xs md:text-sm">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </div>
                          <div className="p-1 truncate">{event.attackType.toUpperCase()}</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Calendario a la derecha del mapa (1/3 del ancho) */}
              <div className="bg-white rounded-lg shadow w-full lg:w-1/3">
                <div className="calendar-container p-4 w-full max-w-full">
                  <h2 className="font-bold text-sm md:text-base mb-2">Date</h2>
                  
                  {/* Fecha grande en formato "5 nov 2024" */}
                  <div className="current-date-display text-xl font-bold mb-4">
                    {date.getDate()} {date.toLocaleString('default', { month: 'short' })} {date.getFullYear()}
                  </div>
                  
                  <div className="calendar-box">
                    <Calendar
                      onChange={(value) => {
                        // Verificar si es un array o un solo valor y manejar ambos casos
                        if (Array.isArray(value)) {
                          if (value[0]) {
                            setDate(value[0]); // Usar la primera fecha si es un array
                          }
                        } else {
                          if (value) {
                            setDate(value as Date);
                          }
                        }
                      }}
                      value={date}
                      className="custom-calendar"
                      formatShortWeekday={(locale, date) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]}
                      navigationLabel={({ date }) => ''}
                      nextLabel={<span>›</span>}
                      prevLabel={<span>‹</span>}
                    />
                  </div>
                  
                  <h2 className="font-bold text-sm md:text-base mt-4 mb-2">Services</h2>
                  
                  <div className="services-boxes">
                    <div className="service-box">
                      <div className="service-icon green">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="service-subtext">Domain Name System</span>
                      <span className="service-text">DNS</span>
                    </div>
                    
                    <div className="service-box">
                      <div className="service-icon yellow">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 5.5V8.5M8 11.5H8.01M3.07 13H12.93C14.03 13 14.76 11.82 14.23 10.89L9.27 2.47C8.74 1.53 7.26 1.53 6.73 2.47L1.77 10.89C1.24 11.82 1.97 13 3.07 13Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="service-subtext">Secure Shell Protocol</span>
                      <span className="service-text">SSH</span>
                    </div>
                    
                    <div className="service-box">
                      <div className="service-icon red">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="service-subtext">Virtual private network</span>
                      <span className="service-text">VPN</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom panels - Last Events y Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Last Events */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-sm md:text-base mb-4">Last Events</h2>
                
                <div className="space-y-2 md:space-y-4">
                  {lastEvents.map((event, index) => (
                    <div key={index} className="flex items-center p-2 hover:bg-gray-50">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        {getFlagEmoji(event.countryCode)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm md:text-base truncate">{event.ip}</div>
                        <div className="text-xs text-gray-500">{event.region}</div>
                      </div>
                      <div className="text-xs text-gray-500 ml-2">{event.time}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Activity */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-bold text-sm md:text-base mb-4">Activity</h2>
                
                <div className="flex justify-end mb-2">
                  <div className="inline-flex bg-gray-100 rounded-full px-2 py-1 text-xs">
                    <button className="px-2 py-1 rounded-full bg-blue-500 text-white whitespace-nowrap">
                      •&nbsp;Attacks
                    </button>
                    <button className="px-2 py-1 text-gray-700 whitespace-nowrap">
                      •&nbsp;Unique sources
                    </button>
                  </div>
                </div>
                
                <div className="h-32 md:h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="attacks" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 0 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sources" 
                        stroke="#5eead4" 
                        strokeWidth={2}
                        dot={{ r: 0 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
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

        /* Animaciones para el mapa */
        .animated-line {
          animation: dashoffset 3s linear;
        }
        
        .origin-pulse {
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