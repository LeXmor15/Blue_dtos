// src/components/dashboard/map/AttackLine.tsx
import React from 'react';
import { AttackLine as AttackLineType } from '../../../types/dashboard';

interface AttackLineProps {
  line: AttackLineType;
  index: number;
  project: (lon: number, lat: number) => [number, number];
}

const AttackLine: React.FC<AttackLineProps> = ({ line, index, project }) => {
  // Función para obtener el color de la línea según el tipo de ataque
  const getLineColor = (attackType: string) => {
    switch (attackType.toLowerCase()) {
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

  try {
    const [sourceX, sourceY] = project(line.source.lng, line.source.lat);
    const [destX, destY] = project(line.destination.lng, line.destination.lat);
    
    // Verificar que los puntos son válidos
    if (isNaN(sourceX) || isNaN(sourceY) || isNaN(destX) || isNaN(destY)) {
      console.warn(`Coordenadas inválidas para la línea de ataque ${line.id || index}`);
      return null;
    }
    
    const lineColor = getLineColor(line.attackType);
    const arcPath = createArc([sourceX, sourceY], [destX, destY]);
    
    // Cálculo para animación con offset único por línea
    const animationOffset = (index % 5) * 0.2;
    
    return (
      <g className="attack-line">
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
    console.error(`Error al renderizar línea de ataque ${line.id || index}:`, error);
    return null;
  }
};

export default AttackLine;