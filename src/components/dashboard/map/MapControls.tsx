// src/components/dashboard/map/MapControls.tsx
import React, { useState, useEffect } from 'react';
import { AttackLine } from '../../../types/dashboard';
import { getAttackTypeColor } from '../../../utils/mapUtils';

interface MapControlsProps {
  attackLines: AttackLine[];
  onFilterChange: (filtered: AttackLine[]) => void;
}

const MapControls: React.FC<MapControlsProps> = ({ attackLines, onFilterChange }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [showBlocked, setShowBlocked] = useState<boolean | null>(null);
  
  // Obtener tipos de ataque únicos
  const getUniqueAttackTypes = (): string[] => {
    const types = new Set<string>();
    attackLines.forEach(line => {
      if (line.attackType) {
        types.add(line.attackType.toLowerCase());
      }
    });
    return Array.from(types).sort();
  };
  
  // Obtener severidades únicas
  const getUniqueSeverities = (): string[] => {
    const severities = new Set<string>();
    attackLines.forEach(line => {
      if (line.severity) {
        severities.add(line.severity.toLowerCase());
      }
    });
    return Array.from(severities).sort();
  };
  
  // Obtener países únicos
  const getUniqueCountries = (): Array<{ code: string, count: number }> => {
    const countries = new Map<string, number>();
    attackLines.forEach(line => {
      if (line.countryCode) {
        const code = line.countryCode;
        countries.set(code, (countries.get(code) || 0) + 1);
      }
    });
    
    return Array.from(countries.entries())
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count);
  };
  
  // Aplicar los filtros cuando cambian las selecciones
  useEffect(() => {
    let filtered = [...attackLines];
    
    // Filtrar por tipo de ataque
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(line => 
        line.attackType && selectedTypes.includes(line.attackType.toLowerCase())
      );
    }
    
    // Filtrar por severidad
    if (selectedSeverities.length > 0) {
      filtered = filtered.filter(line => 
        line.severity && selectedSeverities.includes(line.severity.toLowerCase())
      );
    }
    
    // Filtrar por país
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(line => 
        line.countryCode && selectedCountries.includes(line.countryCode)
      );
    }
    
    // Filtrar por estado de bloqueo
    if (showBlocked !== null) {
      filtered = filtered.filter(line => line.blocked === showBlocked);
    }
    
    onFilterChange(filtered);
  }, [attackLines, selectedTypes, selectedSeverities, selectedCountries, showBlocked, onFilterChange]);
  
  // Alternar la selección de un tipo de ataque
  const toggleAttackType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? 
        prev.filter(t => t !== type) : 
        [...prev, type]
    );
  };
  
  // Alternar la selección de una severidad
  const toggleSeverity = (severity: string) => {
    setSelectedSeverities(prev => 
      prev.includes(severity) ? 
        prev.filter(s => s !== severity) : 
        [...prev, severity]
    );
  };
  
  // Alternar la selección de un país
  const toggleCountry = (countryCode: string) => {
    setSelectedCountries(prev => 
      prev.includes(countryCode) ? 
        prev.filter(c => c !== countryCode) : 
        [...prev, countryCode]
    );
  };
  
  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedSeverities([]);
    setSelectedCountries([]);
    setShowBlocked(null);
  };
  
  // Clase CSS para etiquetas de filtro
  const getFilterTagClass = (selected: boolean) => {
    return `px-2 py-1 rounded text-xs font-medium cursor-pointer transition-colors duration-200 ${
      selected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;
  };
  
  // Obtener color para el tipo de ataque
  const getTypeColor = (type: string) => {
    return getAttackTypeColor(type);
  };
  
  // Obtener color para la severidad
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return '#ef4444'; // Rojo
      case 'high': return '#f97316'; // Naranja
      case 'medium': return '#eab308'; // Amarillo
      case 'low': return '#3b82f6'; // Azul
      default: return '#9ca3af'; // Gris
    }
  };

  return (
    <div className="p-3 bg-gray-800 rounded-lg text-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold">Filtros del mapa</h3>
        <button 
          onClick={clearAllFilters}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Limpiar filtros
        </button>
      </div>
      
      {/* Filtro por tipo de ataque */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold mb-2">Tipo de ataque</h4>
        <div className="flex flex-wrap gap-1">
          {getUniqueAttackTypes().map(type => (
            <div
              key={`type-${type}`}
              className={getFilterTagClass(selectedTypes.includes(type))}
              onClick={() => toggleAttackType(type)}
              style={{
                borderLeft: `3px solid ${getTypeColor(type)}`
              }}
            >
              {type.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
      
      {/* Filtro por severidad */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold mb-2">Severidad</h4>
        <div className="flex flex-wrap gap-1">
          {getUniqueSeverities().map(severity => (
            <div
              key={`severity-${severity}`}
              className={getFilterTagClass(selectedSeverities.includes(severity))}
              onClick={() => toggleSeverity(severity)}
              style={{
                borderLeft: `3px solid ${getSeverityColor(severity)}`
              }}
            >
              {severity.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
      
      {/* Filtro por país (mostrar solo los top 10 por frecuencia) */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold mb-2">País de origen (Top 10)</h4>
        <div className="flex flex-wrap gap-1">
          {getUniqueCountries().slice(0, 10).map(country => (
            <div
              key={`country-${country.code}`}
              className={getFilterTagClass(selectedCountries.includes(country.code))}
              onClick={() => toggleCountry(country.code)}
            >
              {country.code.toUpperCase()} ({country.count})
            </div>
          ))}
        </div>
      </div>
      
      {/* Filtro por estado de bloqueo */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold mb-2">Estado</h4>
        <div className="flex gap-2">
          <div
            className={getFilterTagClass(showBlocked === true)}
            onClick={() => setShowBlocked(prev => prev === true ? null : true)}
          >
            Bloqueados
          </div>
          <div
            className={getFilterTagClass(showBlocked === false)}
            onClick={() => setShowBlocked(prev => prev === false ? null : false)}
          >
            No bloqueados
          </div>
        </div>
      </div>
      
      {/* Estadísticas de filtro */}
      <div className="mt-4 pt-3 border-t border-gray-700 text-xs">
        <div>
          Mostrando: <span className="font-semibold">
            {attackLines.filter(line => {
              // Aplicar los mismos filtros para mostrar el conteo correcto
              let match = true;
              
              if (selectedTypes.length > 0) {
                match = match && Boolean(line.attackType) && selectedTypes.includes(line.attackType.toLowerCase());
              }
              
              if (selectedSeverities.length > 0) {
                match = match && typeof line.severity === 'string' && selectedSeverities.includes(line.severity.toLowerCase());
              }
              
              if (selectedCountries.length > 0) {
                match = match && Boolean(line.countryCode) && selectedCountries.includes(line.countryCode ?? '');
              }
              
              if (showBlocked !== null) {
                match = match && line.blocked === showBlocked;
              }
              
              return match;
            }).length
          } de {attackLines.length}</span> ataques
        </div>
      </div>
    </div>
  );
};

export default MapControls;