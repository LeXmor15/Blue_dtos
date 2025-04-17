// src/components/dashboard/WorldMap.tsx (implementación con Leaflet)
import React, { useRef, useState, useEffect } from 'react';
import { AttackLine } from '../../types/dashboard';
import { getAttackTypeColor, getCountryName } from '../../utils/mapUtils';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Definición de tipos para las propiedades del componente
interface WorldMapProps {
  attackLines: AttackLine[];
}

const WorldMap: React.FC<WorldMapProps> = ({ attackLines }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [attackCounts, setAttackCounts] = useState<Record<string, number>>({});
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [height, setHeight] = useState(500);
  const resizeStartY = useRef(0);
  const initialHeight = useRef(0);
  const [mapReady, setMapReady] = useState(false);
  const attackLinesRef = useRef<{[key: string]: L.Polyline}>({});
  const markersRef = useRef<{[key: string]: L.CircleMarker}>({});
  const destinationMarkersRef = useRef<{[key: string]: L.CircleMarker}>({});

  // Inicializar el mapa
  useEffect(() => {
    if (!mapContainerRef.current || map) return;

    // Crear el mapa con Leaflet
    const leafletMap = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 8,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true
    });

    // Agregar capa base (mapa del mundo oscuro)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(leafletMap);

    // Guardar referencia al mapa
    setMap(leafletMap);
    setMapReady(true);

    // Limpiar el mapa al desmontar el componente
    return () => {
      leafletMap.remove();
    };
  }, []);

  // Calcular estadísticas de ataques por país
  useEffect(() => {
    const counts: Record<string, number> = {};

    attackLines.forEach(line => {
      if (line.countryCode) {
        counts[line.countryCode] = (counts[line.countryCode] || 0) + 1;
      }
    });

    setAttackCounts(counts);
  }, [attackLines]);

  // Renderizar las líneas de ataque cuando cambian
  useEffect(() => {
    if (!map) return;

    // Conjunto para llevar un seguimiento de los IDs activos
    const activeLineIds = new Set<string>();
    const activeMarkerIds = new Set<string>();
    const destinationCoords = new Map<string, {lat: number, lng: number, count: number}>();

    // Crear o actualizar líneas de ataque
    attackLines.forEach((line, index) => {
      const lineId = line.id || `line-${index}`;
      activeLineIds.add(lineId);
      activeMarkerIds.add(`marker-${lineId}`);

      // Obtener coordenadas
      const sourceLatLng = [line.source.lat, line.source.lng] as L.LatLngExpression;
      const destLatLng = [line.destination.lat, line.destination.lng] as L.LatLngExpression;
      
      // Agregar o actualizar marker de origen
      if (!markersRef.current[`marker-${lineId}`]) {
        const color = getAttackTypeColor(line.attackType);
        const marker = L.circleMarker(sourceLatLng, {
          radius: 3,
          fillColor: color,
          color: color,
          weight: 1,
          opacity: 1,
          fillOpacity: 1
        }).addTo(map);
        
        markersRef.current[`marker-${lineId}`] = marker;
      }

      // Registrar destinos únicos y sus conteos
      const destKey = `${line.destination.lat},${line.destination.lng}`;
      if (!destinationCoords.has(destKey)) {
        destinationCoords.set(destKey, {
          lat: line.destination.lat,
          lng: line.destination.lng,
          count: 1
        });
      } else {
        const current = destinationCoords.get(destKey)!;
        destinationCoords.set(destKey, {
          ...current,
          count: current.count + 1
        });
      }

      // Agregar o actualizar línea de ataque si no existe
      if (!attackLinesRef.current[lineId]) {
        // Crear puntos para una línea curva
        const curvedPoints = createCurvedLine(
          [line.source.lat, line.source.lng],
          [line.destination.lat, line.destination.lng],
          0.3, // Factor de curvatura
          10 // Número de puntos
        );
        
        const color = getAttackTypeColor(line.attackType);
        const polyline = L.polyline(curvedPoints, {
          color: color,
          weight: 1.5,
          opacity: 0.7,
          dashArray: '5,3'
        }).addTo(map);
        
        // Añadir flecha al final de la línea
        const arrowIcon = L.divIcon({
          html: `<div style="
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 10px solid ${color};
            transform: rotate(90deg);
          "></div>`,
          className: 'arrow-icon',
          iconSize: [10, 10],
          iconAnchor: [5, 5]
        });
        
        // Colocar la flecha en el último punto de la línea
        const lastPoint = curvedPoints[curvedPoints.length - 1];
        L.marker(lastPoint, { icon: arrowIcon }).addTo(map);
        
        attackLinesRef.current[lineId] = polyline;
      }
    });

    // Crear marcadores de destino para coordenadas únicas
    destinationCoords.forEach((dest, key) => {
      if (!destinationMarkersRef.current[key]) {
        const size = Math.min(10 + Math.log2(dest.count) * 2, 18);
        
        // Marcador central
        const destMarker = L.circleMarker([dest.lat, dest.lng], {
          radius: size / 2,
          fillColor: '#10b981',
          color: '#064e3b',
          weight: 1,
          opacity: 1,
          fillOpacity: 1
        }).addTo(map);
        
        // Área de efecto alrededor del destino
        const areaMarker = L.circleMarker([dest.lat, dest.lng], {
          radius: size,
          fillColor: '#10b981',
          color: '#10b981',
          weight: 1,
          opacity: 0.3,
          fillOpacity: 0.3
        }).addTo(map);
        
        destinationMarkersRef.current[key] = destMarker;
      }
    });

    // Eliminar líneas y marcadores que ya no están activos
    Object.keys(attackLinesRef.current).forEach(id => {
      if (!activeLineIds.has(id)) {
        map.removeLayer(attackLinesRef.current[id]);
        delete attackLinesRef.current[id];
      }
    });

    Object.keys(markersRef.current).forEach(id => {
      if (!activeMarkerIds.has(id)) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

  }, [attackLines, map]);

  // Ajustar el tamaño del mapa cuando cambia la altura o el modo de pantalla completa
  useEffect(() => {
    if (map) {
      map.invalidateSize();
    }
  }, [map, height, isFullscreen]);

  // Función para crear puntos para una línea curva
  const createCurvedLine = (
    start: [number, number],
    end: [number, number],
    intensity: number,
    numPoints: number
  ): L.LatLngExpression[] => {
    const points: L.LatLngExpression[] = [];
    
    // Calcular punto de control para la curva
    const controlPoint = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 
      // Ajustar la dirección de la curva basándose en la longitud
      ((end[1] > start[1] ? -1 : 1) * 
      // Calcular la distancia aproximada
      Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)) * 
      intensity)
    ];
    
    // Crear puntos a lo largo de la curva cuadrática
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      
      // Interpolación cuadrática de Bezier
      const lat = Math.pow(1 - t, 2) * start[0] + 
                  2 * (1 - t) * t * controlPoint[0] + 
                  Math.pow(t, 2) * end[0];
                  
      const lng = Math.pow(1 - t, 2) * start[1] + 
                 2 * (1 - t) * t * controlPoint[1] + 
                 Math.pow(t, 2) * end[1];
                 
      points.push([lat, lng]);
    }
    
    return points;
  };

  // Controles de zoom
  const handleZoomIn = () => {
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    if (map) map.zoomOut();
  };

  // Restablecer vista
  const handleReset = () => {
    if (map) {
      map.setView([20, 0], 2);
    }
  };

  // Alternar pantalla completa
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Iniciar redimensionamiento
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleResizeEnd);
    resizeStartY.current = e.clientY;
    initialHeight.current = height;
  };

  // Manejar el movimiento durante el redimensionamiento
  const handleMouseMove = (e: MouseEvent) => {
    const diff = e.clientY - resizeStartY.current;
    const newHeight = Math.max(200, initialHeight.current + diff);
    setHeight(newHeight);
  };

  // Finalizar el redimensionamiento
  const handleResizeEnd = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    
    // Notificar al mapa del cambio de tamaño
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  };

  // Ordenar ataques por tipo para la leyenda
  const getAttackTypes = (): string[] => {
    const types = new Set<string>();
    attackLines.forEach(line => types.add(line.attackType.toLowerCase()));
    return Array.from(types).sort();
  };

  return (
    <div className={`relative bg-gray-800 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div
        ref={mapContainerRef}
        className={`relative bg-gray-900 overflow-hidden ${isFullscreen ? 'h-full' : ''}`}
        style={{ height: isFullscreen ? '100%' : `${height}px` }}
      >
        {/* Contador de ataques total */}
        <div className="absolute top-2 left-16 bg-gray-900 bg-opacity-80 text-white px-3 py-1 rounded text-sm z-[1000]">
          Total ataques: {attackLines.length}
        </div>

        {/* Botón de pantalla completa */}
        <button
          className="absolute top-2 right-2 bg-white bg-opacity-80 text-black text-xs p-1 w-6 h-6 rounded-full flex items-center justify-center hover:bg-opacity-100 z-[1000]"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          {isFullscreen ? "✖" : "⛶"}
        </button>

        {/* Controles del mapa */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1 z-[1000]">
          <button
            className="bg-white bg-opacity-80 text-black text-xs p-1 w-6 h-6 rounded-full flex items-center justify-center hover:bg-opacity-100"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            className="bg-white bg-opacity-80 text-black text-xs p-1 w-6 h-6 rounded-full flex items-center justify-center hover:bg-opacity-100"
            onClick={handleZoomOut}
            aria-label="Zoom out"
          >
            -
          </button>
          <button
            className="bg-white bg-opacity-80 text-black text-xs p-1 w-6 h-6 rounded-full flex items-center justify-center hover:bg-opacity-100"
            onClick={handleReset}
            aria-label="Reset view"
          >
            ↺
          </button>
        </div>

        {/* Leyenda */}
        <div className="absolute bottom-2 right-2 bg-gray-900 bg-opacity-80 text-white p-2 rounded text-xs z-[1000]">
          <div className="font-semibold mb-1 border-b pb-1">Tipos de ataques</div>
          {getAttackTypes().map(type => (
            <div key={type} className="flex items-center mb-1">
              <span
                className="inline-block w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: getAttackTypeColor(type) }}
              />
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>

        {/* Tooltip para país al hacer hover */}
        {hoveredCountry && (
          <div className="absolute top-2 left-16 bg-gray-900 bg-opacity-80 text-white px-2 py-1 rounded text-xs z-[1000]">
            <div className="font-semibold">{getCountryName(hoveredCountry)}</div>
            <div>Ataques: {attackCounts[hoveredCountry] || 0}</div>
          </div>
        )}

        {/* Indicador de carga mientras se procesa el mapa */}
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-[1010]">
            <div className="text-white">Cargando mapa...</div>
          </div>
        )}
      </div>

      {/* Handle para redimensionar (cuando no está en pantalla completa) */}
      {!isFullscreen && (
        <div
          className="h-2 w-full bg-gray-800 hover:bg-gray-700 cursor-ns-resize flex items-center justify-center"
          onMouseDown={handleResizeStart}
        >
          <div className="w-10 h-1 bg-gray-600 rounded-full"></div>
        </div>
      )}

      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes dashOffset {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -16; }
        }
        
        .attack-line {
          animation: dashOffset 3s linear infinite;
        }
        
        .pulse-marker {
          animation: pulse 1.5s ease-out infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          70% { opacity: 0.5; transform: scale(2); }
          100% { opacity: 0; transform: scale(3); }
        }
        
        .destination-pulse {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default WorldMap;