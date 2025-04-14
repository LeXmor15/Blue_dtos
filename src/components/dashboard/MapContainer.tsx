// src/components/dashboard/MapContainer.tsx (versión corregida)
import React, { useState, useEffect } from 'react';
import WorldMap from './WorldMap';
import MapControls from './map/MapControls';
import { useAttackData } from '../../hooks/useAttackData';
import { AttackLine } from '../../types/dashboard';
import { worldGeoJson } from './map/worldGeoJson';
import '../../styles/map.css'; // Importar estilos específicos del mapa

const MapContainer: React.FC = () => {
  const {
    filteredAttackLines,
    loading,
    error,
    refreshData,
    applyFilters,
    autoRefresh,
    toggleAutoRefresh
  } = useAttackData(5000); // Actualiza cada 5 segundos

  console.log('MapContainer rendering with attack data:', { filteredAttackLines, loading, error });

  // Estado para mostrar/ocultar los controles
  const [showControls, setShowControls] = useState(false);
  
  // Estado para el GeoJSON personalizado
  const [customGeoJson, setCustomGeoJson] = useState<any>(null);

  // Cargar GeoJSON personalizado
  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        console.log("Intentando cargar custom.geo.json...");
        const response = await fetch('/custom.geo.json');
        
        if (!response.ok) {
          throw new Error(`Error cargando GeoJSON: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("GeoJSON cargado exitosamente:", data);
        
        if (data && data.type === 'FeatureCollection' && Array.isArray(data.features)) {
          setCustomGeoJson(data);
        } else {
          console.error('Formato GeoJSON inválido:', data);
          setCustomGeoJson(worldGeoJson);
        }
      } catch (error) {
        console.error('Error al cargar GeoJSON:', error);
        // En caso de error, usar el GeoJSON predeterminado
        console.log('Usando GeoJSON por defecto');
        setCustomGeoJson(worldGeoJson);
      }
    };

    loadGeoJson();
  }, []);

  // Si ocurre un error
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
        <h3 className="font-bold text-lg mb-2">Error al cargar el mapa</h3>
        <p>{error.message}</p>
        <button 
          onClick={refreshData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="attack-map-container">
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
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar ahora'}
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
              attackLines={filteredAttackLines} 
              onFilterChange={applyFilters}
            />
          </div>
        )}
        
        {/* Mapa principal */}
        <div className={`flex-grow ${loading ? 'opacity-70' : ''} relative`}>
          {customGeoJson && (
            <WorldMap 
              attackLines={filteredAttackLines} 
              geoJsonData={customGeoJson}
            />
          )}
          
          {/* Indicador de carga */}
          {loading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <div className="loading-text">Actualizando datos...</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Estadísticas de ataques */}
      <div className="bg-gray-800 px-4 py-2 flex justify-between text-white text-sm border-t border-gray-700">
        <div>Total de ataques: <span className="font-semibold">{filteredAttackLines.length}</span></div>
        <div>
          Bloqueados: <span className="font-semibold">
            {filteredAttackLines.filter((line: AttackLine) => line.blocked).length}
            ({filteredAttackLines.length > 0 ? Math.round(filteredAttackLines.filter((line: AttackLine) => line.blocked).length / filteredAttackLines.length * 100) : 0}%)
          </span>
        </div>
        <div>
          Críticos: <span className="font-semibold text-red-400">
            {filteredAttackLines.filter((line: AttackLine) => line.severity === 'critical').length}
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

export default MapContainer;