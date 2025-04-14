// src/hooks/useMapData.ts
import { useState, useEffect, useCallback } from 'react';
import { AttackLine, AttackEvent } from '../types/dashboard';
import { useDashboard } from '../context/DashboardContext';

/**
 * Hook personalizado para gestionar los datos del mapa
 * Utiliza el contexto de Dashboard para obtener y filtrar datos
 */
export const useMapData = () => {
  const { 
    attackLines, 
    attackEvents, 
    isLoading, 
    refreshData, 
    addAttackLine 
  } = useDashboard();
  
  const [filteredLines, setFilteredLines] = useState<AttackLine[]>(attackLines);
  const [showCountryCodes, setShowCountryCodes] = useState<string[]>([]);
  const [selectedAttackTypes, setSelectedAttackTypes] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  
  // Actualizar las líneas filtradas cuando cambian las líneas de ataque o los filtros
  useEffect(() => {
    let filtered = [...attackLines];
    
    // Filtrar por país
    if (showCountryCodes.length > 0) {
      filtered = filtered.filter(line => 
        line.countryCode && showCountryCodes.includes(line.countryCode)
      );
    }
    
    // Filtrar por tipo de ataque
    if (selectedAttackTypes.length > 0) {
      filtered = filtered.filter(line => 
        selectedAttackTypes.includes(line.attackType)
      );
    }
    
    // Filtrar por severidad
    if (selectedSeverities.length > 0) {
      filtered = filtered.filter(line => 
        line.severity && selectedSeverities.includes(line.severity)
      );
    }
    
    setFilteredLines(filtered);
  }, [attackLines, showCountryCodes, selectedAttackTypes, selectedSeverities]);
  
  // Función para simular un ataque aleatorio
  const simulateRandomAttack = useCallback(() => {
    if (attackEvents.length === 0) return;
    
    // Seleccionar un evento aleatorio
    const randomEvent = attackEvents[Math.floor(Math.random() * attackEvents.length)];
    
    // Añadir línea de ataque
    addAttackLine(randomEvent);
  }, [attackEvents, addAttackLine]);
  
  // Función para convertir un evento de ataque a una línea de ataque
  const eventToLine = (event: AttackEvent): AttackLine => {
    return {
      id: `line-${event.id}-${Date.now()}`,
      source: { lat: event.sourceLat, lng: event.sourceLong },
      destination: { lat: event.destLat, lng: event.destLong },
      timestamp: Date.now(),
      attackType: event.attackType,
      severity: event.severity,
      ipAddress: event.sourceIp,
      countryCode: event.countryCode
    };
  };
  
  // Función para filtrar líneas por tipo de ataque
  const filterByAttackType = (types: string[]) => {
    setSelectedAttackTypes(types);
  };
  
  // Función para filtrar líneas por país
  const filterByCountry = (countryCodes: string[]) => {
    setShowCountryCodes(countryCodes);
  };
  
  // Función para filtrar líneas por severidad
  const filterBySeverity = (severities: string[]) => {
    setSelectedSeverities(severities);
  };
  
  // Limpiar todos los filtros
  const clearFilters = () => {
    setShowCountryCodes([]);
    setSelectedAttackTypes([]);
    setSelectedSeverities([]);
  };
  
  // Aplicar filtros externos
  const applyFilters = (filtered: AttackLine[]) => {
    setFilteredLines(filtered);
  };
  
  return {
    attackLines,
    filteredLines,
    isLoading,
    refreshData,
    simulateRandomAttack,
    eventToLine,
    filterByAttackType,
    filterByCountry,
    filterBySeverity,
    clearFilters,
    applyFilters
  };
};

export default useMapData;