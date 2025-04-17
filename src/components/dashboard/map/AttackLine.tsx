// src/components/dashboard/map/AttackLine.tsx (Componente adaptado para Leaflet)
import React, { useEffect, useRef } from 'react';
import { AttackLine as AttackLineType } from '../../../types/dashboard';
import L from 'leaflet';
import { getAttackTypeColor } from '../../../utils/mapUtils';

interface AttackLineProps {
  line: AttackLineType;
  index: number;
  map: L.Map;
}

const AttackLine: React.FC<AttackLineProps> = ({ line, index, map }) => {
  const lineRef = useRef<L.Polyline | null>(null);
  const sourceMarkerRef = useRef<L.CircleMarker | null>(null);
  const pulseMarkerRef = useRef<L.CircleMarker | null>(null);
  const arrowRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    // Limpiar al desmontar
    return () => {
      if (lineRef.current) map.removeLayer(lineRef.current);
      if (sourceMarkerRef.current) map.removeLayer(sourceMarkerRef.current);
      if (pulseMarkerRef.current) map.removeLayer(pulseMarkerRef.current);
      if (arrowRef.current) map.removeLayer(arrowRef.current);
    };
  }, [map]);

  useEffect(() => {
    // Crear línea de ataque solo si no existe ya
    if (!lineRef.current) {
      // Obtener color para este tipo de ataque
      const color = getAttackTypeColor(line.attackType);
      
      // Coordenadas de origen y destino
      const sourceLatLng: L.LatLngExpression = [line.source.lat, line.source.lng];
      const destLatLng: L.LatLngExpression = [line.destination.lat, line.destination.lng];
      
      // Crear puntos para una línea curva
      const curvedPoints = createCurvedLine(
        [line.source.lat, line.source.lng],
        [line.destination.lat, line.destination.lng],
        0.3, // Factor de curvatura
        10  // Número de puntos
      );
      
      // Crear la línea
      const polyline = L.polyline(curvedPoints, {
        color: color,
        weight: 1.5,
        opacity: 0.7,
        dashArray: '5,3',
        className: 'attack-line'
      }).addTo(map);
      
      // Añadir marker en el origen
      const marker = L.circleMarker(sourceLatLng, {
        radius: 3,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map);
      
      // Añadir marker de pulso en el origen
      const pulseMarker = L.circleMarker(sourceLatLng, {
        radius: 3,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 0.7,
        fillOpacity: 0.5,
        className: 'pulse-marker'
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
      const arrow = L.marker(lastPoint, { icon: arrowIcon }).addTo(map);
      
      // Añadir tooltip con información
      polyline.bindTooltip(`
        <div>
          <strong>${line.attackType.toUpperCase()}</strong>
          <div>Origen: ${line.ipAddress || 'Desconocido'}</div>
          <div>Severidad: ${line.severity || 'Desconocida'}</div>
        </div>
      `, { 
        sticky: true, 
        className: 'attack-info-tooltip' 
      });
      
      // Guardar referencias para limpieza
      lineRef.current = polyline;
      sourceMarkerRef.current = marker;
      pulseMarkerRef.current = pulseMarker;
      arrowRef.current = arrow;
    }
  }, [line, map, index]);
  
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

  return null; // Este componente no renderiza nada directamente, maneja la lógica de Leaflet
};

export default AttackLine;