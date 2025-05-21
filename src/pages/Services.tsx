// src/pages/Services.tsx
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Types
interface Service {
  id: string;
  name: string;
  description: string;
  status: 'ok' | 'warning' | 'error' | 'inactive';
  uptime: number;
  lastIncident?: string;
  metrics: {
    cpu: number;
    memory: number;
    network: number;
    responseTime: number;
  };
}

interface TimelineData {
  time: string;
  responseTime: number;
  requests: number;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'issues'>('all');

  useEffect(() => {
    // Load services data
    loadServices();
    
    // Set up periodic data refresh
    const interval = setInterval(() => {
      updateMetrics();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // When a service is selected, load its detailed timeline data
    if (selectedService) {
      loadTimelineData(selectedService.id);
    }
  }, [selectedService]);

  const loadServices = () => {
    setIsLoading(true);
    
    // Simulate loading data from API
    setTimeout(() => {
      const mockServices: Service[] = [
        {
          id: 'dns-1',
          name: 'DNS',
          description: 'Domain Name System',
          status: 'ok',
          uptime: 99.98,
          metrics: {
            cpu: 12,
            memory: 28,
            network: 45,
            responseTime: 42
          }
        },
        {
          id: 'ssh-1',
          name: 'SSH',
          description: 'Secure Shell Protocol',
          status: 'warning',
          uptime: 98.45,
          lastIncident: '2024-11-03 14:23',
          metrics: {
            cpu: 32,
            memory: 45,
            network: 28,
            responseTime: 68
          }
        },
        {
          id: 'http-1',
          name: 'HTTP',
          description: 'Web Server',
          status: 'ok',
          uptime: 99.95,
          metrics: {
            cpu: 22,
            memory: 35,
            network: 72,
            responseTime: 56
          }
        },
        {
          id: 'vpn-1',
          name: 'VPN',
          description: 'Virtual Private Network',
          status: 'error',
          uptime: 87.32,
          lastIncident: '2024-11-05 09:15',
          metrics: {
            cpu: 85,
            memory: 76,
            network: 15,
            responseTime: 230
          }
        },
        {
          id: 'smtp-1',
          name: 'SMTP',
          description: 'Email Service',
          status: 'ok',
          uptime: 99.87,
          metrics: {
            cpu: 18,
            memory: 32,
            network: 41,
            responseTime: 75
          }
        },
        {
          id: 'db-1',
          name: 'Database',
          description: 'Primary Database Cluster',
          status: 'ok',
          uptime: 99.99,
          metrics: {
            cpu: 42,
            memory: 68,
            network: 32,
            responseTime: 28
          }
        },
        {
          id: 'cache-1',
          name: 'Cache',
          description: 'Redis Cache Service',
          status: 'warning',
          uptime: 98.76,
          lastIncident: '2024-11-04 22:34',
          metrics: {
            cpu: 38,
            memory: 76,
            network: 25,
            responseTime: 12
          }
        },
        {
          id: 'mq-1',
          name: 'Message Queue',
          description: 'RabbitMQ Service',
          status: 'inactive',
          uptime: 0,
          lastIncident: '2024-11-05 07:12',
          metrics: {
            cpu: 0,
            memory: 0,
            network: 0,
            responseTime: 0
          }
        }
      ];
      
      setServices(mockServices);
      
      // Set first service as selected by default
      if (mockServices.length > 0) {
        setSelectedService(mockServices[0]);
      }
      
      setIsLoading(false);
    }, 800);
  };
  
  const updateMetrics = () => {
    // Simulate updating metrics in real-time
    setServices(prevServices => 
      prevServices.map(service => {
        // Only update active services
        if (service.status !== 'inactive') {
          // Random fluctuations
          const cpuDelta = Math.random() * 10 - 5;
          const memDelta = Math.random() * 8 - 4;
          const netDelta = Math.random() * 12 - 6;
          const rtDelta = Math.random() * 20 - 10;
          
          return {
            ...service,
            metrics: {
              cpu: Math.max(0, Math.min(100, service.metrics.cpu + cpuDelta)),
              memory: Math.max(0, Math.min(100, service.metrics.memory + memDelta)),
              network: Math.max(0, Math.min(100, service.metrics.network + netDelta)),
              responseTime: Math.max(0, service.metrics.responseTime + rtDelta)
            }
          };
        }
        return service;
      })
    );
  };
  
  const loadTimelineData = (serviceId: string) => {
    // Generate 24 hours of timeline data with hourly intervals
    const now = new Date();
    const data: TimelineData[] = [];
    
    for (let i = 0; i < 24; i++) {
      const time = new Date(now);
      time.setHours(now.getHours() - 23 + i);
      
      // Base values depending on service type
      let baseResponseTime = 50;
      let baseRequests = 1000;
      
      // Adjust base values for different services
      if (serviceId.startsWith('dns')) {
        baseResponseTime = 40;
        baseRequests = 2000;
      } else if (serviceId.startsWith('http')) {
        baseResponseTime = 60;
        baseRequests = 3000;
      } else if (serviceId.startsWith('vpn')) {
        baseResponseTime = 120;
        baseRequests = 500;
      }
      
      // Add randomness
      const variance = Math.sin(i / 3) * 0.3 + Math.random() * 0.2;
      const responseTime = Math.round(baseResponseTime * (1 + variance));
      const requests = Math.round(baseRequests * (1 + variance * 0.5));
      
      // Simulate incidents for services with warning/error status
      const service = services.find(s => s.id === serviceId);
      if (service?.status === 'error' && i === 18) {
        // Major spike for error services around 18 hours ago
        data.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          responseTime: responseTime * 4,
          requests: Math.round(requests * 0.5)
        });
      } else if (service?.status === 'warning' && (i === 14 || i === 16)) {
        // Minor spikes for warning services
        data.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          responseTime: responseTime * 2,
          requests: Math.round(requests * 0.8)
        });
      } else {
        data.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          responseTime,
          requests
        });
      }
    }
    
    setTimelineData(data);
  };
  
  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'ok':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'inactive':
        return 'bg-gray-400';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusText = (status: Service['status']) => {
    switch (status) {
      case 'ok':
        return 'Operational';
      case 'warning':
        return 'Degraded';
      case 'error':
        return 'Outage';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };
  
  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(service => service.status === 'warning' || service.status === 'error');

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Services</h1>
          
          <div className="flex items-center space-x-4">
            {/* Filter toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filter:</span>
              <select 
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'issues')}
              >
                <option value="all">All Services</option>
                <option value="issues">Issues Only</option>
              </select>
            </div>
            
            {/* View toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
              <button
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zm-10 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {/* Refresh button */}
            <button 
              className="p-2 bg-blue-500 text-white rounded-md text-sm flex items-center"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  updateMetrics();
                  setIsLoading(false);
                }, 500);
              }}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Services grid or list */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredServices.map(service => (
                  <div
                    key={service.id}
                    className={`bg-white rounded-lg shadow overflow-hidden cursor-pointer transition-all ${
                      selectedService?.id === service.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg">{service.name}</h3>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}></div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="font-medium">Status</div>
                          <div className={`
                            ${service.status === 'ok' ? 'text-green-600' : 
                              service.status === 'warning' ? 'text-yellow-600' : 
                              service.status === 'error' ? 'text-red-600' : 'text-gray-500'}
                          `}>
                            {getStatusText(service.status)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium">Uptime</div>
                          <div>{service.uptime.toFixed(2)}%</div>
                        </div>
                        
                        <div>
                          <div className="font-medium">CPU</div>
                          <div className="flex items-center">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  service.metrics.cpu > 80 ? 'bg-red-500' : 
                                  service.metrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${service.metrics.cpu}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs">{Math.round(service.metrics.cpu)}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium">Memory</div>
                          <div className="flex items-center">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  service.metrics.memory > 80 ? 'bg-red-500' : 
                                  service.metrics.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${service.metrics.memory}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs">{Math.round(service.metrics.memory)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {service.lastIncident && (
                      <div className="bg-gray-50 p-2 text-xs border-t">
                        <span className="font-medium">Last incident:</span> {service.lastIncident}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Incident</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredServices.map((service) => (
                      <tr 
                        key={service.id} 
                        className={`cursor-pointer ${
                          selectedService?.id === service.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedService(service)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                              service.status === 'ok' ? 'bg-green-100' : 
                              service.status === 'warning' ? 'bg-yellow-100' : 
                              service.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
                            }`}>
                              <span className="font-bold text-sm">{service.name.substring(0, 1)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{service.name}</div>
                              <div className="text-xs text-gray-500">{service.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            service.status === 'ok' ? 'bg-green-100 text-green-800' : 
                            service.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                            service.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {getStatusText(service.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.uptime.toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  service.metrics.cpu > 80 ? 'bg-red-500' : 
                                  service.metrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${service.metrics.cpu}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs text-gray-500">{Math.round(service.metrics.cpu)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  service.metrics.memory > 80 ? 'bg-red-500' : 
                                  service.metrics.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${service.metrics.memory}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs text-gray-500">{Math.round(service.metrics.memory)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.round(service.metrics.responseTime)} ms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.lastIncident || 'None'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Service details with timeline */}
            {selectedService && (
              <div className="bg-white rounded-lg shadow p-4 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedService.status)} mr-2`}></div>
                    {selectedService.name} Details
                  </h2>
                  
                  <div className="flex space-x-4">
                    <div className="text-sm">
                      <span className="font-medium">Status:</span>{' '}
                      <span className={
                        selectedService.status === 'ok' ? 'text-green-600' : 
                        selectedService.status === 'warning' ? 'text-yellow-600' : 
                        selectedService.status === 'error' ? 'text-red-600' : 'text-gray-500'
                      }>
                        {getStatusText(selectedService.status)}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">Uptime:</span> {selectedService.uptime.toFixed(2)}%
                    </div>
                    
                    {selectedService.lastIncident && (
                      <div className="text-sm">
                        <span className="font-medium">Last incident:</span> {selectedService.lastIncident}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Response Time Graph */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Response Time (Last 24 Hours)</h3>
                    <div className="h-72 bg-white p-2 rounded border">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="time" 
                            tick={{ fontSize: 12 }}
                            interval={3}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            domain={['auto', 'auto']}
                            label={{ 
                              value: 'ms', 
                              angle: -90, 
                              position: 'insideLeft',
                              style: { fontSize: 12 }
                            }}
                          />
                          <Tooltip formatter={(value) => [`${value} ms`, 'Response Time']} />
                          <Line 
                            type="monotone" 
                            dataKey="responseTime" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={{ r: 1 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Request Volume Graph */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Request Volume (Last 24 Hours)</h3>
                    <div className="h-72 bg-white p-2 rounded border">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="time" 
                            tick={{ fontSize: 12 }}
                            interval={3}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            domain={['auto', 'auto']}
                            label={{ 
                              value: 'requests', 
                              angle: -90, 
                              position: 'insideLeft',
                              style: { fontSize: 12 }
                            }}
                          />
                          <Tooltip formatter={(value) => [`${value} requests`, 'Volume']} />
                          <Line 
                            type="monotone" 
                            dataKey="requests" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            dot={{ r: 1 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                {/* Service metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">CPU Usage</h3>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold mr-2">{Math.round(selectedService.metrics.cpu)}%</div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            selectedService.metrics.cpu > 80 ? 'bg-red-500' : 
                            selectedService.metrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${selectedService.metrics.cpu}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Memory Usage</h3>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold mr-2">{Math.round(selectedService.metrics.memory)}%</div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            selectedService.metrics.memory > 80 ? 'bg-red-500' : 
                            selectedService.metrics.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${selectedService.metrics.memory}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Network Usage</h3>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold mr-2">{Math.round(selectedService.metrics.network)}%</div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            selectedService.metrics.network > 80 ? 'bg-red-500' : 
                            selectedService.metrics.network > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${selectedService.metrics.network}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Response Time</h3>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold mr-2">{Math.round(selectedService.metrics.responseTime)} ms</div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            selectedService.metrics.responseTime > 150 ? 'bg-red-500' : 
                            selectedService.metrics.responseTime > 100 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, selectedService.metrics.responseTime / 2)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex justify-end mt-6 space-x-3">
                  <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    View Logs
                  </button>
                  <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    Configuration
                  </button>
                  <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Restart Service
                  </button>
                </div>
              </div>
            )}
            
            {/* System Health Summary */}
            <div className="bg-white rounded-lg shadow p-4 mt-6">
              <h2 className="text-lg font-semibold mb-4">System Health Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded border border-green-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-green-800">Operational</h3>
                    <span className="text-2xl font-bold text-green-500">
                      {services.filter(s => s.status === 'ok').length}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Services running normally
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded border border-yellow-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-yellow-800">Degraded</h3>
                    <span className="text-2xl font-bold text-yellow-500">
                      {services.filter(s => s.status === 'warning').length}
                    </span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">
                    Services with performance issues
                  </p>
                </div>
                
                <div className="bg-red-50 p-4 rounded border border-red-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-red-800">Outages</h3>
                    <span className="text-2xl font-bold text-red-500">
                      {services.filter(s => s.status === 'error').length}
                    </span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Services experiencing failures
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded border border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-800">Inactive</h3>
                    <span className="text-2xl font-bold text-gray-500">
                      {services.filter(s => s.status === 'inactive').length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Services temporarily disabled
                  </p>
                </div>
              </div>
              
              {/* Overall Status */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Overall System Status</h3>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${
                    services.some(s => s.status === 'error') ? 'bg-red-500' :
                    services.some(s => s.status === 'warning') ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="font-medium">
                    {services.some(s => s.status === 'error') ? 'System experiencing critical issues' :
                     services.some(s => s.status === 'warning') ? 'System functioning with degraded performance' : 'All systems operational'}
                  </span>
                </div>
                
                <div className="mt-2 text-sm text-gray-500">
                  <span className="font-medium">Last updated:</span> {new Date().toLocaleString()}
                </div>
              </div>
            </div>
            
            {/* Recent Alerts */}
            <div className="bg-white rounded-lg shadow p-4 mt-6">
              <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
              
              {services.some(s => s.status === 'warning' || s.status === 'error') ? (
                <div className="divide-y">
                  {services
                    .filter(s => s.status === 'error' || s.status === 'warning')
                    .map((service, index) => (
                      <div key={`alert-${service.id}`} className="py-3">
                        <div className="flex items-start">
                          <div className={`mt-0.5 w-3 h-3 rounded-full ${service.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'} mr-3`}></div>
                          <div>
                            <h3 className="font-medium">{service.name} {service.status === 'error' ? 'Outage' : 'Performance Issue'}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {service.status === 'error' 
                                ? `Service is currently experiencing an outage. Our team is investigating the issue.`
                                : `Service is experiencing degraded performance. Monitoring for improvement.`}
                            </p>
                            {service.lastIncident && (
                              <p className="text-xs text-gray-500 mt-1">
                                Detected at {service.lastIncident}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No active alerts at this time</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Services;