// src/components/dashboard/map/MapControls.tsx
import React, { useState } from 'react';
import { AttackLine } from '../../../types/dashboard';

interface MapControlsProps {
  attackLines: AttackLine[];
  onFilterChange: (filteredLines: AttackLine[]) => void;
}

const MapControls: React.FC<MapControlsProps> = ({ attackLines, onFilterChange }) => {
  const [selectedAttackTypes, setSelectedAttackTypes] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<string>('all'); // 'all', 'day', 'week', 'month'
  const [severityLevels, setSeverityLevels] = useState<string[]>([]);
  const [showOnlyBlocked, setShowOnlyBlocked] = useState<boolean>(false);
  
  // Extraer todos los tipos de ataque únicos
  const attackTypes = Array.from(new Set(attackLines.map(line => line.attackType.toLowerCase())));
  
  // Extraer todos los países únicos (asumiendo que existe countryCode)
  const countries = Array.from(
    new Set(
      attackLines
        .filter(line => line.countryCode)
        .map(line => line.countryCode as string)
    )
  );
  
  // Función para aplicar filtros
  const applyFilters = () => {
    let filtered = [...attackLines];
    
    // Filtrar por tipo de ataque
    if (selectedAttackTypes.length > 0) {
      filtered = filtered.filter(line => 
        selectedAttackTypes.includes(line.attackType.toLowerCase())
      );
    }
    
    // Filtrar por país
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(line => 
        line.countryCode && selectedCountries.includes(line.countryCode)
      );
    }
    
    // Filtrar por rango de tiempo
    if (timeRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (timeRange) {
        case 'day':
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(line => {
        const attackDate = new Date(line.timestamp);
        return attackDate >= cutoffDate;
      });
    }
    
    // Filtrar por nivel de severidad
    if (severityLevels.length > 0) {
      filtered = filtered.filter(line => 
        severityLevels.includes(line.severity
          ? line.severity.toLowerCase() : 'unknown'
        )
      );
    }
    
    // Filtrar por estado de bloqueo
    if (showOnlyBlocked) {
      filtered = filtered.filter(line => line.blocked);
    }
    
    // Enviar los resultados filtrados
    onFilterChange(filtered);
  };
  
  // Manejadores de eventos para los filtros
  const handleAttackTypeChange = (type: string) => {
    setSelectedAttackTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  const handleCountryChange = (country: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(country)) {
        return prev.filter(c => c !== country);
      } else {
        return [...prev, country];
      }
    });
  };
  
  const handleSeverityChange = (severity: string) => {
    setSeverityLevels(prev => {
      if (prev.includes(severity)) {
        return prev.filter(s => s !== severity);
      } else {
        return [...prev, severity];
      }
    });
  };
  
  // Limpiar todos los filtros
  const clearFilters = () => {
    setSelectedAttackTypes([]);
    setSelectedCountries([]);
    setTimeRange('all');
    setSeverityLevels([]);
    setShowOnlyBlocked(false);
    onFilterChange(attackLines);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-3 text-white text-sm">
      <h3 className="font-bold mb-2 text-base">Filtros del mapa</h3>
      
      {/* Filtro de tipo de ataque */}
      <div className="mb-3">
        <h4 className="font-semibold mb-1">Tipo de ataque</h4>
        <div className="space-y-1 max-h-28 overflow-y-auto">
          {attackTypes.map(type => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAttackTypes.includes(type)}
                onChange={() => handleAttackTypeChange(type)}
                className="mr-2"
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
          {attackTypes.length === 0 && (
            <p className="text-gray-400 text-xs">No hay datos disponibles</p>
          )}
        </div>
      </div>
      
      {/* Filtro de país */}
      <div className="mb-3">
        <h4 className="font-semibold mb-1">País de origen</h4>
        <div className="space-y-1 max-h-28 overflow-y-auto">
          {countries.map(country => (
            <label key={country} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCountries.includes(country)}
                onChange={() => handleCountryChange(country)}
                className="mr-2"
              />
              <span>{country}</span>
            </label>
          ))}
          {countries.length === 0 && (
            <p className="text-gray-400 text-xs">No hay datos disponibles</p>
          )}
        </div>
      </div>
      
      {/* Filtro de tiempo */}
      <div className="mb-3">
        <h4 className="font-semibold mb-1">Período de tiempo</h4>
        <div className="space-y-1">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="timeRange"
              checked={timeRange === 'all'}
              onChange={() => setTimeRange('all')}
              className="mr-2"
            />
            <span>Todo</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="timeRange"
              checked={timeRange === 'day'}
              onChange={() => setTimeRange('day')}
              className="mr-2"
            />
            <span>Último día</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="timeRange"
              checked={timeRange === 'week'}
              onChange={() => setTimeRange('week')}
              className="mr-2"
            />
            <span>Última semana</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="timeRange"
              checked={timeRange === 'month'}
              onChange={() => setTimeRange('month')}
              className="mr-2"
            />
            <span>Último mes</span>
          </label>
        </div>
      </div>
      
      {/* Filtro de severidad */}
      <div className="mb-3">
        <h4 className="font-semibold mb-1">Severidad</h4>
        <div className="space-y-1">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={severityLevels.includes('low')}
              onChange={() => handleSeverityChange('low')}
              className="mr-2"
            />
            <span>Baja</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={severityLevels.includes('medium')}
              onChange={() => handleSeverityChange('medium')}
              className="mr-2"
            />
            <span>Media</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={severityLevels.includes('high')}
              onChange={() => handleSeverityChange('high')}
              className="mr-2"
            />
            <span>Alta</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={severityLevels.includes('critical')}
              onChange={() => handleSeverityChange('critical')}
              className="mr-2"
            />
            <span>Crítica</span>
          </label>
        </div>
      </div>
      
      {/* Filtro de bloqueo */}
      <div className="mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyBlocked}
            onChange={() => setShowOnlyBlocked(!showOnlyBlocked)}
            className="mr-2"
          />
          <span>Solo mostrar ataques bloqueados</span>
        </label>
      </div>
      
      {/* Botones de acción */}
      <div className="flex space-x-2">
        <button
          onClick={applyFilters}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md flex-1"
        >
          Aplicar filtros
        </button>
        <button
          onClick={clearFilters}
          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-md"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default MapControls;