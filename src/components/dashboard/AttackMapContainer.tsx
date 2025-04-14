// src/components/dashboard/AttackMapContainer.tsx
import React, { useState, useEffect } from 'react';
import WorldMap from './WorldMap';
import MapControls from './map/MapControls';
import MapLegend from './map/MapLegend';
import { useDashboard } from '../../context/DashboardContext';
import { AttackLine } from '../../types/dashboard';
import { loadGeoJson } from '../../utils/geoUtils';
import { worldGeoJson, WorldGeoJsonType } from './map/worldGeoJson';

interface WorldMapProps {
  attackLines: AttackLine[];
}

// Estilos aplicados directamente al contenedor del mapa
const mapContainerStyles = {
  backgroundColor: '#0f172a', // Color de fondo oscuro
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  borderRadius: '0.5rem',
  overflow: 'hidden'
};

const AttackMapContainer: React.FC = () => {
  const { 
    attackLines, 
    isLoading, 
    refreshData, 
    attackEvents,
    addAttackLine
  } = useDashboard();

  // Estado para las líneas filtradas
  const [filteredLines, setFilteredLines] = useState<AttackLine[]>([]);
  
  // Estado para activar/desactivar auto-actualización
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  
  // Estado para mostrar/ocultar controles del mapa
  const [showControls, setShowControls] = useState<boolean>(false);
  
  // Estado para gestionar el GeoJSON
  const [geoJsonData, setGeoJsonData] = useState<WorldGeoJsonType>(worldGeoJson);
  
  // Estadísticas de ataques
  const [stats, setStats] = useState({
    total: 0,
    blocked: 0,
    critical: 0,
    types: new Set<string>()
  });

  // Cargar el GeoJSON personalizado
  useEffect(() => {
    // Intentar cargar el GeoJSON personalizado (si existe)
    const loadCustomGeoJson = async () => {
      try {
        // Si estás usando una ruta específica, ajústarla aquí
        const customGeoJson = await loadGeoJson('/api/custom-geojson');
        setGeoJsonData(customGeoJson);
      } catch (error) {
        console.error('Error cargando GeoJSON personalizado:', error);
        // Si hay error, usar el GeoJSON por defecto
        // setGeoJsonData(worldGeoJson);
      }
    };
    
    loadCustomGeoJson();
    
    // Alternativamente, puedes cargar el archivo directamente:
    // import customGeoJson from './custom.geo.json';
    // setGeoJsonData(customGeoJson);
  }, []);

  // Efecto para actualizar líneas filtradas al cambiar las líneas originales
  useEffect(() => {
    setFilteredLines(attackLines);
    
    // Calcular estadísticas
    const blocked = attackLines.filter(line => line.blocked).length;
    const critical = attackLines.filter(line => 
      line.severity === 'critical' || line.severity === 'high'
    ).length;
    
    const types = new Set<string>();
    attackLines.forEach(line => types.add(line.attackType.toLowerCase()));
    
    setStats({
      total: attackLines.length,
      blocked,
      critical,
      types
    });
  }, [attackLines]);

  // Configurar intervalo de auto-actualización
  useEffect(() => {
    if (!autoRefresh) return;
    
    const intervalId = setInterval(() => {
      // Simular un nuevo ataque aleatorio si hay eventos disponibles
      if (attackEvents.length > 0) {
        const randomEvent = attackEvents[Math.floor(Math.random() * attackEvents.length)];
        addAttackLine(randomEvent);
      }
    }, 3000); // Cada 3 segundos
    
    return () => clearInterval(intervalId);
  }, [autoRefresh, attackEvents, addAttackLine]);

  // Aplicar filtros a las líneas de ataque
  const applyFilters = (filtered: AttackLine[]) => {
    setFilteredLines(filtered);
  };

  // Manejador para alternar auto-actualización
  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };

  return (
    <div style={mapContainerStyles} className="flex flex-col">
      {/* Barra superior con controles */}
      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-white font-bold">Mapa de Ataques en Tiempo Real</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={toggleAutoRefresh}
            className={`px-3 py-1 rounded text-xs ${
              autoRefresh 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 hover:bg-gray-500'
            } text-white`}
          >
            {autoRefresh ? 'Auto-actualización: ON' : 'Auto-actualización: OFF'}
          </button>
          
          <button
            onClick={refreshData}
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
          <div className="w-64 p-2 bg-gray-800 border-r border-gray-700">
            <MapControls 
              attackLines={attackLines} 
              onFilterChange={applyFilters}
            />
          </div>
        )}
        
        {/* Mapa principal */}
        <div className={`flex-grow ${isLoading ? 'opacity-70' : ''} relative`}>
          <WorldMap 
            attackLines={filteredLines} 
            geoJsonData={geoJsonData}
          />
          
          {/* Indicador de carga */}
          {isLoading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-lg p-3 z-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
              <div className="text-white text-center mt-2 text-sm">Actualizando datos...</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Estadísticas de ataques */}
      <div className="bg-gray-800 px-4 py-2 flex justify-between text-white text-sm border-t border-gray-700">
        <div>Total de ataques: <span className="font-semibold">{stats.total}</span></div>
        <div>
          Bloqueados: <span className="font-semibold">
            {stats.blocked} 
            ({stats.total > 0 ? Math.round((stats.blocked / stats.total) * 100) : 0}%)
          </span>
        </div>
        <div>
          Críticos: <span className="font-semibold text-red-400">
            {stats.critical}
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

export default AttackMapContainer;