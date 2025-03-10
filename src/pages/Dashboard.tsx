// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../components/layout/DashboardLayout';
import { fetchSecurityEvents, fetchActivityData } from '../services/dashboardService';

// Tipos para los datos
interface SecurityEvent {
  id: number;
  status: string;
  flag: string;
  ip: string;
  country: string;
  protocol: string;
  date: string;
  port: number;
  activity: string;
  severity: string;
  user: string;
}

interface LastEvent {
  ip: string;
  region: string;
  time: string;
}

interface ActivityData {
  month: string;
  attacks: number;
  sources: number;
}

interface Day {
  date: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
}

type CalendarGrid = Day[][];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('realtime');
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [lastEvents, setLastEvents] = useState<LastEvent[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // En una aplicación real, estas serían llamadas a tu API
        const eventsData = await fetchSecurityEvents();
        const activity = await fetchActivityData();
        
        setSecurityEvents(eventsData.events);
        setLastEvents(eventsData.lastEvents);
        setActivityData(activity);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Función para generar el calendario
  const generateCalendarGrid = (): CalendarGrid => {
    const today = new Date(2024, 10, 5); // Nov 5, 2024
    const month = today.getMonth();
    const year = today.getFullYear();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const grid: CalendarGrid = [];
    let currentWeek: Day[] = [];
    
    // Llenar celdas vacías para días del mes anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push({ date: 0, isCurrentMonth: false });
    }
    
    // Llenar días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      currentWeek.push({ 
        date: i, 
        isCurrentMonth: true,
        isToday: i === today.getDate()
      });
      
      if (currentWeek.length === 7) {
        grid.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Llenar días restantes con el próximo mes
    if (currentWeek.length > 0) {
      const remainingDays = 7 - currentWeek.length;
      for (let i = 0; i < remainingDays; i++) {
        currentWeek.push({ date: i + 1, isCurrentMonth: false });
      }
      grid.push(currentWeek);
    }
    
    return grid;
  };

  const calendarGrid = generateCalendarGrid();

  // Función para obtener el ícono de bandera según el código
  const getFlagEmoji = (countryCode: string) => {
    switch (countryCode) {
      case 'us': return '🇺🇸';
      case 'de': return '🇩🇪';
      case 'gb': return '🇬🇧';
      case 'cn': return '🇨🇳';
      case 'ru': return '🇷🇺';
      case 'nl': return '🇳🇱';
      default: return '🌐';
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
            {/* Map and table container */}
            <div className="bg-gray-800 rounded-lg overflow-hidden mb-4">
              {/* World map */}
              <div className="h-[300px] relative bg-gray-900">
                {/* Placeholder for map - you'll replace this with your SVG */}
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  World Map Placeholder
                </div>
                
                {/* Controls */}
                <div className="absolute top-2 left-2 flex space-x-1">
                  <button className="bg-white text-black text-xs p-1 rounded">+</button>
                  <button className="bg-white text-black text-xs p-1 rounded">-</button>
                </div>
              </div>
              
              {/* Table */}
              <div className="p-2">
                <div className="grid grid-cols-6 gap-1 text-xs text-white">
                  <div className="p-1 font-medium">Status</div>
                  <div className="p-1 font-medium">Origin</div>
                  <div className="p-1 font-medium">Target</div>
                  <div className="p-1 font-medium">Protocol</div>
                  <div className="p-1 font-medium">Date & Time</div>
                  <div className="p-1 font-medium">Activity</div>
                  
                  {securityEvents.map((event) => (
                    <React.Fragment key={event.id}>
                      <div className="p-1 flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          event.status === 'red' ? 'bg-red-500' : 
                          event.status === 'orange' ? 'bg-orange-500' : 'bg-green-500'
                        }`}></div>
                      </div>
                      <div className="p-1 flex items-center">
                        <span className="mr-2">{getFlagEmoji(event.flag)}</span>
                        <span>{event.ip}</span>
                      </div>
                      <div className="p-1 flex items-center">
                        <span className="mr-2">🇳🇱</span>
                        <span>192.168.1.1</span>
                      </div>
                      <div className="p-1">{event.protocol}</div>
                      <div className="p-1">{event.date}</div>
                      <div className="p-1">{event.activity}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Bottom panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Last Events */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-bold mb-4">Last Events</h2>
                
                <div className="space-y-4">
                  {lastEvents.map((event, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        🇺🇸
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{event.ip}</div>
                        <div className="text-xs text-gray-500">{event.region}</div>
                      </div>
                      <div className="text-xs text-gray-500">{event.time}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Activity */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-bold mb-4">Activity</h2>
                
                <div className="flex justify-end mb-2">
                  <div className="inline-flex bg-gray-100 rounded-full px-2 py-1 text-xs">
                    <button className="px-2 py-1 rounded-full bg-blue-500 text-white">•&nbsp;Attacks</button>
                    <button className="px-2 py-1 text-gray-700">•&nbsp;Free sources</button>
                  </div>
                </div>
                
                <div className="h-40">
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
      
      {/* Right sidebar */}
      <div className="hidden lg:block w-64 bg-white border-l border-gray-200 p-4 absolute right-0 top-14 bottom-0">
        {/* Date */}
        <div className="mb-6">
          <h2 className="font-medium mb-2">Date</h2>
          <div className="text-xl font-bold mb-4">5 nov 2024</div>
          
          {/* Calendar */}
          <div className="mb-4">
            <div className="grid grid-cols-7 gap-1 text-xs text-center mb-1">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            
            {calendarGrid.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
                {week.map((day, dayIndex) => (
                  <div 
                    key={`${weekIndex}-${dayIndex}`} 
                    className={`text-xs text-center rounded-full w-6 h-6 flex items-center justify-center mx-auto ${
                      !day.isCurrentMonth ? 'text-gray-300' : 
                      day.isToday ? 'bg-blue-500 text-white' : 'text-gray-700'
                    }`}
                  >
                    {day.date > 0 ? day.date : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Services */}
        <div>
          <h2 className="font-medium mb-4">Services</h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <span className="text-white text-xs">✓</span>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500">Domain Name System</div>
                <div className="font-medium">DNS</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                <span className="text-white text-xs">!</span>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500">Secure Shell Protocol</div>
                <div className="font-medium">SSH</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mr-3">
                <span className="text-white text-xs">×</span>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500">Virtual Private Network</div>
                <div className="font-medium">VPN</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;