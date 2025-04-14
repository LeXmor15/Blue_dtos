// src/components/dashboard/WorldMap.tsx (versión corregida)
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AttackLine } from '../../types/dashboard';
import { worldGeoJson, getCountryColor, getCountryName } from './map/worldGeoJson';
import * as d3 from 'd3';

// Definiciones de tipos para GeoJSON
interface GeoJSONGeometry {
  type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';
  coordinates: any; // Puede ser complejo, así que usamos any para simplificar
}

interface GeoJSONFeature {
  type: 'Feature';
  id?: string;
  properties: {
    name?: string;
    code?: string;
    iso_a3?: string;
    ISO_A3?: string;
    [key: string]: any; // Para otras propiedades
  };
  geometry: GeoJSONGeometry;
}

interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

interface WorldMapProps {
  attackLines: AttackLine[];
  geoJsonData?: GeoJSONCollection; // Opcional, si no se proporciona se usa el valor por defecto
}

const WorldMap: React.FC<WorldMapProps> = ({ attackLines, geoJsonData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [attackCounts, setAttackCounts] = useState<Record<string, number>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [height, setHeight] = useState(500); // Altura inicial del mapa
  const resizeStartY = useRef(0);
  const initialHeight = useRef(0);
  const [mapReady, setMapReady] = useState(false);
  const [geoData, setGeoData] = useState<GeoJSONCollection | null>(null);
  
  // Inicializar la proyección con una opción segura por defecto
  const [projection, setProjection] = useState(() => {
    return d3.geoMercator()
      .scale(150)
      .center([0, 20])
      .translate([480, 250]);
  });

  // Cargar GeoJSON personalizado
  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        console.log("Intentando cargar GeoJSON desde custom.geo.json");
        const response = await fetch('/custom.geo.json');
        
        if (!response.ok) {
          throw new Error(`Error cargando GeoJSON: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("GeoJSON cargado correctamente:", data);
        
        if (data && data.type === 'FeatureCollection' && Array.isArray(data.features)) {
          setGeoData(data);
        } else {
          console.error('Formato GeoJSON inválido:', data);
          setGeoData(worldGeoJson as GeoJSONCollection);
        }
      } catch (error) {
        console.error('Error al cargar GeoJSON:', error);
        console.log('Usando GeoJSON por defecto');
        setGeoData(worldGeoJson as GeoJSONCollection);
      }
      
      // Indicar que el mapa está listo para renderizar
      setMapReady(true);
    };

    // Si se proporciona geoJsonData como prop, usarlo
    if (geoJsonData) {
      console.log("Usando GeoJSON proporcionado como prop:", geoJsonData);
      setGeoData(geoJsonData);
      setMapReady(true);
    } else {
      // Si no, intentar cargar desde archivo
      loadGeoJson();
    }
  }, [geoJsonData]);

  // Configurar la proyección D3 cuando cambia el GeoJSON
  useEffect(() => {
    if (svgRef.current && geoData && Array.isArray(geoData.features) && geoData.features.length > 0) {
      try {
        const width = svgRef.current.clientWidth || 960;
        const height = svgRef.current.clientHeight || 500;

        // Crear una proyección más robusta
        const newProjection = d3.geoMercator()
          .scale(150)
          .center([0, 20])
          .translate([width / 2, height / 2]);

        // Intentar hacer fitSize solo si es seguro
        try {
          // Verificar que las geometrías sean válidas para fitSize
          if (geoData.features.some(f =>
            f && f.geometry &&
            (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') &&
            Array.isArray(f.geometry.coordinates)
          )) {
            newProjection.fitSize([width, height], geoData);
          }
        } catch (fitError) {
          console.warn('No se pudo ajustar la proyección al GeoJSON:', fitError);
        }

        // Validar que la proyección funciona
        const testCoords = newProjection([0, 0]);
        if (testCoords && !testCoords.some(isNaN)) {
          console.log('Proyección configurada correctamente');
          setProjection(newProjection);
        }
      } catch (error) {
        console.error('Error en la proyección:', error);
      }
    }
  }, [geoData, svgRef.current?.clientWidth, svgRef.current?.clientHeight]);

  // Calcular estadísticas de ataques por país
  useEffect(() => {
    const counts: Record<string, number> = {};

    attackLines.forEach(line => {
      // Usamos el countryCode que viene directamente en la línea de ataque si está disponible
      if (line.countryCode) {
        counts[line.countryCode] = (counts[line.countryCode] || 0) + 1;
      } else {
        // Si no hay countryCode, lo intentamos obtener de las coordenadas
        const countryCode = getCountryFromCoordinates(line.source.lng, line.source.lat);
        if (countryCode) {
          counts[countryCode] = (counts[countryCode] || 0) + 1;
        }
      }
    });

    setAttackCounts(counts);
  }, [attackLines]);

  // Función para obtener el país a partir de coordenadas
  const getCountryFromCoordinates = (lng: number, lat: number): string | null => {
    // Mapeo simplificado de rangos de coordenadas a códigos de país
    // América del Norte
    if (lng > -130 && lng < -60 && lat > 20 && lat < 50) return 'USA';
    // Europa Occidental
    if (lng > -10 && lng < 20 && lat > 35 && lat < 60) {
      if (lng > -10 && lng < 2 && lat > 50 && lat < 60) return 'GBR';
      if (lng > 5 && lng < 15 && lat > 47 && lat < 55) return 'DEU';
      if (lng > -5 && lng < 8 && lat > 42 && lat < 52) return 'FRA';
      if (lng > -10 && lng < 3 && lat > 36 && lat < 44) return 'ESP';
      return 'EUR'; // Otro país europeo
    }
    // Asia
    if (lng > 75 && lng < 135 && lat > 20 && lat < 45) return 'CHN';
    if (lng > 30 && lng < 180 && lat > 50 && lat < 75) return 'RUS';
    if (lng > 125 && lng < 150 && lat > 30 && lat < 45) return 'JPN';
    if (lng > 65 && lng < 90 && lat > 5 && lat < 35) return 'IND';

    // Devolver null si no se encuentra correspondencia
    return null;
  };

  // Función para obtener el color de la línea según el tipo de ataque
  const getLineColor = (attackType: string) => {
    const type = attackType.toLowerCase();
    switch (type) {
      case 'ssh': return '#ef4444'; // Rojo
      case 'http': return '#3b82f6'; // Azul
      case 'https': return '#8b5cf6'; // Púrpura
      case 'ftp': return '#22c55e'; // Verde
      case 'telnet': return '#f97316'; // Naranja
      case 'rdp': return '#ec4899'; // Rosa
      case 'smtp': return '#14b8a6'; // Turquesa
      case 'dns': return '#eab308'; // Amarillo
      case 'icmp': return '#64748b'; // Gris azulado
      case 'snmp': return '#0ea5e9'; // Celeste
      case 'sql': return '#f43f5e'; // Rojo rosado
      default: return '#94a3b8'; // Gris
    }
  };

  // Proyección de coordenadas geográficas a coordenadas SVG usando D3
  const project = (lon: number, lat: number): [number, number] => {
    // Validar inputs
    if (typeof lon !== 'number' || typeof lat !== 'number' || isNaN(lon) || isNaN(lat)) {
      return [0, 0]; // Valor seguro por defecto
    }

    try {
      // Asegurarse de que la proyección existe
      if (!projection) {
        return [0, 0];
      }

      // Proyectar las coordenadas de forma segura
      const projected = projection([lon, lat]);

      // Validar el resultado
      if (!projected || !Array.isArray(projected) || projected.length < 2 ||
        typeof projected[0] !== 'number' || typeof projected[1] !== 'number' ||
        isNaN(projected[0]) || isNaN(projected[1])) {
        return [0, 0];
      }

      return [projected[0], projected[1]];
    } catch (error) {
      console.warn('Error en la proyección:', error);
      return [0, 0];
    }
  };

  // Iniciar el arrastre
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Solo considerar clic izquierdo

    setDragging(true);
    setDragStart({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    });

    e.preventDefault();
  };

  // Manejar el movimiento durante el arrastre
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));

      e.preventDefault();
    }

    if (resizing) {
      const diff = e.clientY - resizeStartY.current;
      const newHeight = Math.max(200, initialHeight.current + diff);
      setHeight(newHeight);
      e.preventDefault();
    }
  }, [dragging, dragStart, resizing]);

  // Finalizar el arrastre o redimensionamiento
  const handleMouseUp = useCallback(() => {
    setDragging(false);
    setResizing(false);
  }, []);

  // Iniciar redimensionamiento
  const handleResizeStart = (e: React.MouseEvent) => {
    setResizing(true);
    resizeStartY.current = e.clientY;
    initialHeight.current = height;
    e.preventDefault();
  };

  // Manejo del zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const newScale = Math.max(0.5, Math.min(transform.scale + delta, 4));

    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const x = mouseX - (mouseX - transform.x) * (newScale / transform.scale);
      const y = mouseY - (mouseY - transform.y) * (newScale / transform.scale);

      setTransform({ x, y, scale: newScale });
    }
  };

  // Evitar scroll de la página cuando el cursor está sobre el mapa
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScroll = (e: WheelEvent) => {
      e.preventDefault();
    };

    container.addEventListener('wheel', preventScroll, { passive: false });

    return () => {
      container.removeEventListener('wheel', preventScroll);
    };
  }, []);

  // Configurar event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Controles de zoom
  const handleZoomIn = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale + 0.2, 4)
    }));
  };

  const handleZoomOut = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale - 0.2, 0.5)
    }));
  };

  // Restablecer vista
  const handleReset = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  // Alternar pantalla completa
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Crear arco curvo entre dos puntos para las líneas de ataque
  const createArc = (start: [number, number], end: [number, number]): string => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Calcular punto de control para el arco
    const midX = (start[0] + end[0]) / 2;
    const midY = (start[1] + end[1]) / 2 - dist / 3; // Curvatura hacia arriba
    
    return `M${start[0]},${start[1]} Q${midX},${midY} ${end[0]},${end[1]}`;
  };

  // Ordenar ataques por tipo para la leyenda
  const getAttackTypes = (): string[] => {
    const types = new Set<string>();
    attackLines.forEach(line => types.add(line.attackType.toLowerCase()));
    return Array.from(types).sort();
  };

  // Renderizar países utilizando D3 para la proyección
  const renderCountries = () => {
    if (!geoData?.features || !Array.isArray(geoData.features) || !projection) {
      console.warn("Datos GeoJSON inválidos o proyección no disponible");
      return null;
    }

    return geoData.features.map((feature: GeoJSONFeature, index: number) => {
      if (!feature?.geometry?.coordinates) {
        console.warn(`Característica inválida en el índice ${index}`);
        return null;
      }

      try {
        // Obtener el identificador del país
        const countryId = feature.id ||
          (feature.properties && (feature.properties.iso_a3 || feature.properties.ISO_A3)) ||
          "unknown";

        const isHovered = hoveredCountry === countryId;

        // Generar el path SVG utilizando D3
        const pathGenerator = d3.geoPath().projection(projection);
        const pathData = pathGenerator(feature as any);

        if (!pathData) {
          console.warn(`No se pudo generar path para: ${countryId}`);
          return null;
        }

        return (
          <path
            key={`country-${countryId}-${index}`}
            d={pathData}
            fill={getCountryColor(countryId as string, attackCounts, true)}
            stroke="#1f2937"
            strokeWidth="0.5"
            opacity={isHovered ? 1 : 0.8}
            filter={isHovered ? "url(#glow)" : ""}
            data-country={countryId}
            onMouseEnter={() => setHoveredCountry(countryId as string)}
            onMouseLeave={() => setHoveredCountry(null)}
            className="transition-all duration-200"
          />
        );
      } catch (error) {
        console.error(`Error al renderizar feature ${index}:`, error);
        return null;
      }
    }).filter(Boolean); // Eliminar elementos nulos
  };

  return (
    <div className={`relative bg-gray-800 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div
        ref={containerRef}
        className={`relative bg-gray-900 overflow-hidden ${isFullscreen ? 'h-full' : ''}`}
        style={{ height: isFullscreen ? '100%' : `${height}px` }}
      >
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          viewBox="0 0 960 500"
          preserveAspectRatio="xMidYMid meet"
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
        >
          <defs>
            {/* Gradiente para el fondo oceánico */}
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>

            {/* Filtro de brillo para países resaltados */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Animación para líneas de ataque */}
            <marker id="attackArrow" viewBox="0 0 10 10" refX="5" refY="5"
              markerWidth="4" markerHeight="4" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffffff" />
            </marker>
          </defs>

          {/* Fondo del mapa */}
          <rect
            x="0"
            y="0"
            width="960"
            height="500"
            fill="url(#oceanGradient)"
          />

          <g
            transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}
          >
            {/* Países del mundo desde GeoJSON */}
            <g className="countries">
              {geoData && renderCountries()}
            </g>

            {/* Líneas de ataque */}
            <g className="attack-lines">
              {attackLines.map((line, index) => {
                try {
                  const [sourceX, sourceY] = project(line.source.lng, line.source.lat);
                  const [destX, destY] = project(line.destination.lng, line.destination.lat);
                  const lineColor = getLineColor(line.attackType);
                  const arcPath = createArc([sourceX, sourceY], [destX, destY]);

                  // Cálculo para animación con offset único por línea
                  const animationOffset = (index % 5) * 0.2;

                  return (
                    <g key={`attack-line-${line.id || index}`} className="attack-line">
                      {/* Línea de ataque curva */}
                      <path
                        d={arcPath}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth="1.5"
                        strokeDasharray="5,3"
                        opacity="0.7"
                        markerEnd="url(#attackArrow)"
                        style={{
                          animation: `dashOffset 3s linear ${animationOffset}s infinite`
                        }}
                      />

                      {/* Punto de origen */}
                      <circle
                        cx={sourceX}
                        cy={sourceY}
                        r="3"
                        fill={lineColor}
                        className="origin-pulse"
                        style={{
                          animation: `pulse 1.5s ease-out ${animationOffset}s infinite`
                        }}
                      />
                    </g>
                  );
                } catch (error) {
                  console.error(`Error al renderizar línea de ataque ${index}:`, error);
                  return null;
                }
              }).filter(Boolean)}
            </g>

            {/* Destino de los ataques */}
            {attackLines.length > 0 && (
              <g className="destination-marker">
                {(() => {
                  // Obtener coordenadas únicas de destino
                  const uniqueDestinations: Record<string, { lng: number, lat: number, count: number }> = {};

                  attackLines.forEach(line => {
                    const key = `${line.destination.lng},${line.destination.lat}`;
                    if (!uniqueDestinations[key]) {
                      uniqueDestinations[key] = {
                        lng: line.destination.lng,
                        lat: line.destination.lat,
                        count: 1
                      };
                    } else {
                      uniqueDestinations[key].count++;
                    }
                  });

                  return Object.entries(uniqueDestinations).map(([key, dest], index) => {
                    try {
                      const [destX, destY] = project(dest.lng, dest.lat);
                      const size = Math.min(10 + Math.log2(dest.count) * 2, 18);

                      return (
                        <g key={`dest-${key}-${index}`}>
                          <circle
                            cx={destX}
                            cy={destY}
                            r={size}
                            fill="#10b981"
                            fillOpacity="0.3"
                            stroke="#10b981"
                            strokeWidth="1"
                          />
                          <circle
                            cx={destX}
                            cy={destY}
                            r={size / 2}
                            fill="#10b981"
                            stroke="#064e3b"
                            strokeWidth="1"
                          />
                          <circle
                            cx={destX}
                            cy={destY}
                            r={size * 1.5}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1"
                            opacity="0.5"
                            style={{
                              animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                            }}
                          />
                        </g>
                      );
                    } catch (error) {
                      console.error(`Error al renderizar destino ${index}:`, error);
                      return null;
                    }
                  }).filter(Boolean);
                })()}
              </g>
            )}
          </g>
        </svg>

        {/* Contador de ataques total */}
        <div className="absolute top-2 left-16 bg-gray-900 bg-opacity-80 text-white px-3 py-1 rounded text-sm z-10">
          Total ataques: {attackLines.length}
        </div>

        {/* Botón de pantalla completa */}
        <button
          className="absolute top-2 right-2 bg-white bg-opacity-80 text-black text-xs p-1 w-6 h-6 rounded-full flex items-center justify-center hover:bg-opacity-100 z-10"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          {isFullscreen ? "✖" : "⛶"}
        </button>

        {/* Controles del mapa */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
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
        <div className="absolute bottom-2 right-2 bg-gray-900 bg-opacity-80 text-white p-2 rounded text-xs z-10">
          <div className="font-semibold mb-1 border-b pb-1">Tipos de ataques</div>
          {getAttackTypes().map(type => (
            <div key={type} className="flex items-center mb-1">
              <span
                className="inline-block w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: getLineColor(type) }}
              />
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>

        {/* Tooltip para país al hacer hover */}
        {hoveredCountry && (
          <div className="absolute top-2 left-16 bg-gray-900 bg-opacity-80 text-white px-2 py-1 rounded text-xs z-10">
            <div className="font-semibold">{getCountryName(hoveredCountry)}</div>
            <div>Ataques: {attackCounts[hoveredCountry] || 0}</div>
          </div>
        )}

        {/* Indicador de carga mientras se procesa el mapa */}
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-20">
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
        
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          70% { opacity: 0.5; transform: scale(2); }
          100% { opacity: 0; transform: scale(3); }
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