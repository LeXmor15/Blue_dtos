// src/components/dashboard/map/MapLegend.tsx
import React from 'react';

interface MapLegendProps {
  attackTypes: string[];
  getLineColor: (type: string) => string;
  className?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ 
  attackTypes, 
  getLineColor, 
  className = '' 
}) => {
  return (
    <div className={`map-legend ${className}`}>
      <div className="legend-title">Tipos de ataques</div>
      
      {attackTypes.length > 0 ? (
        attackTypes.map(type => (
          <div key={type} className="legend-item">
            <span 
              className="legend-color" 
              style={{ backgroundColor: getLineColor(type) }} 
            />
            <span className="capitalize">{type}</span>
          </div>
        ))
      ) : (
        <div className="text-gray-400">No hay ataques registrados</div>
      )}
    </div>
  );
};

// Versión simplificada si no hay datos dinámicos
const SimpleMapLegend: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute bottom-2 right-2 bg-gray-900 bg-opacity-70 text-white p-2 rounded text-xs ${className}`}>
      <div className="font-semibold mb-1 border-b pb-1">Tipos de ataques</div>
      <div className="flex items-center mb-1">
        <span className="inline-block w-3 h-3 mr-2 rounded-full bg-red-500"></span>
        <span>SSH</span>
      </div>
      <div className="flex items-center mb-1">
        <span className="inline-block w-3 h-3 mr-2 rounded-full bg-blue-500"></span>
        <span>HTTP/HTTPS</span>
      </div>
      <div className="flex items-center mb-1">
        <span className="inline-block w-3 h-3 mr-2 rounded-full bg-green-500"></span>
        <span>FTP</span>
      </div>
      <div className="flex items-center">
        <span className="inline-block w-3 h-3 mr-2 rounded-full bg-orange-500"></span>
        <span>Otros</span>
      </div>
    </div>
  );
};

export { SimpleMapLegend };
export default MapLegend;