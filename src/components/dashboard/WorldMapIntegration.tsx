// src/components/dashboard/WorldMapIntegration.tsx
import React, { useState, useEffect } from 'react';
import WorldMap from './WorldMap';
import MapControls from './map/MapControls';
import { useDashboard } from '../../context/DashboardContext';
import { AttackLine } from '../../types/dashboard';

const WorldMapIntegration: React.FC = () => {
  const { 
    attackLines, 
    isLoading, 
    refreshData, 
    attackEvents,
    addAttackLine
  } = useDashboard();

  const [filteredLines, setFilteredLines] = useState<AttackLine[]>(attackLines);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(false);

  // Aplicar filtros a las líneas de ataque
  const applyFilters = (filtered: AttackLine[]) => {
    setFilteredLines(filtered);
  };

  // Efecto para actualizar las líneas filtradas cuando cambian las líneas originales
  useEffect(() => {
    setFilteredLines(attackLines);
  }, [attackLines]);

  // Configurar intervalo de actualización automática para simular ataques
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      // Simular un nuevo ataque aleatorio si hay eventos de ataque disponibles
      if (attackEvents.length > 0) {
        const randomAttack = attackEvents[Math.floor(Math.random() * attackEvents.length)];
        addAttackLine(randomAttack);
      }
    }, 2000); // Cada 2 segundos

    return () => clearInterval(intervalId);
  }, [autoRefresh, attackEvents, addAttackLine]);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Barra superior con controles */}
      <div className="bg-gray-700 px-4 py-2 flex justify-between items-center">
        <h2 className="text-white font-bold">Mapa de Ataques en Tiempo Real</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 rounded text-xs ${
              autoRefresh 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 hover:bg-gray-500'
            } text-white`}
          >
            {autoRefresh ? 'Auto-actualización: ON' : 'Auto-actualización: OFF'}
          </button>
          
          <button
            onClick={() => refreshData()}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs"
            disabled={isLoading}
          >
            {isLoading ? 'Actualizando...' : 'Actualizar ahora'}
          </button>
          
          <button
            onClick={() => setShowControls(!showControls)}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-xs"
          >
            {showControls ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
        </div>
      </div>
      
      {/* Contenedor principal */}
      <div className="flex">
        {/* Panel de filtros (condicional) */}
        {showControls && (
          <div className="w-64 p-2 bg-gray-800">
            <MapControls 
              attackLines={attackLines} 
              onFilterChange={applyFilters}
            />
          </div>
        )}
        
        {/* Mapa principal */}
        <div className={`flex-grow ${isLoading ? 'opacity-70' : ''}`}>
          <WorldMap attackLines={filteredLines} />
          
          {/* Indicador de carga */}
          {isLoading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-lg p-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
              <div className="text-white text-center mt-2 text-sm">Actualizando datos...</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Estadísticas de ataques */}
      <div className="bg-gray-700 px-4 py-2 flex justify-between text-white text-sm">
        <div>Total de ataques visualizados: <span className="font-semibold">{filteredLines.length}</span></div>
        <div>
          Bloqueados: <span className="font-semibold">
            {filteredLines.filter(line => line.blocked).length || 0} 
            ({filteredLines.length > 0 ? Math.round((filteredLines.filter(line => line.blocked).length || 0) / filteredLines.length * 100) : 0}%)
          </span>
        </div>
        <div>
          Críticos: <span className="font-semibold text-red-400">
            {filteredLines.filter(line => line.severity === 'critical' || line.severity === 'high').length || 0}
          </span>
        </div>
        <div>
          Última actualización: <span className="font-semibold">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorldMapIntegration;