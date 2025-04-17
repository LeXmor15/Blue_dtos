// src/utils/mapUtils.ts (Actualizado para Leaflet)
import L from 'leaflet';

/**
 * Convierte códigos de país a nombre completo
 * @param code Código ISO del país
 * @returns Nombre del país
 */
export const getCountryName = (code: string): string => {
  const countryNames: Record<string, string> = {
    'USA': 'Estados Unidos',
    'CAN': 'Canadá',
    'MEX': 'México',
    'BRA': 'Brasil',
    'ARG': 'Argentina',
    'CHL': 'Chile',
    'COL': 'Colombia',
    'PER': 'Perú',
    'GBR': 'Reino Unido',
    'DEU': 'Alemania',
    'FRA': 'Francia',
    'ESP': 'España',
    'ITA': 'Italia',
    'PRT': 'Portugal',
    'NLD': 'Países Bajos',
    'BEL': 'Bélgica',
    'CHE': 'Suiza',
    'SWE': 'Suecia',
    'NOR': 'Noruega',
    'POL': 'Polonia',
    'RUS': 'Rusia',
    'UKR': 'Ucrania',
    'TUR': 'Turquía',
    'CHN': 'China',
    'JPN': 'Japón',
    'KOR': 'Corea del Sur',
    'IND': 'India',
    'AUS': 'Australia',
    'NZL': 'Nueva Zelanda',
    'ZAF': 'Sudáfrica',
    'EGY': 'Egipto',
    'MAR': 'Marruecos',
    'NGA': 'Nigeria',
    'KEN': 'Kenia',
    'SAU': 'Arabia Saudí',
    'IRN': 'Irán',
    // Añadir más países según necesidad
  };
  
  return countryNames[code] || code;
};

/**
 * Obtiene un color para el país según la intensidad de ataques
 * @param count Número de ataques
 * @param maxCount Número máximo de ataques (para normalizar)
 * @returns Color en formato hexadecimal
 */
export const getIntensityColor = (count: number, maxCount: number): string => {
  // Si no hay ataques, color base
  if (count === 0) return '#1e293b';
  
  // Normalizar la cuenta (0-1)
  const normalizedCount = Math.min(count / (maxCount || 1), 1);
  
  // Colores para la escala (de menos a más intenso)
  const colors = [
    [59, 130, 246],   // Azul claro (#3b82f6)
    [37, 99, 235],    // Azul medio (#2563eb)
    [29, 78, 216],    // Azul fuerte (#1d4ed8)
    [30, 64, 175],    // Azul intenso (#1e40af)
    [30, 58, 138]     // Azul muy intenso (#1e3a8a)
  ];
  
  // Encontrar el índice basado en el valor normalizado
  const index = Math.min(
    Math.floor(normalizedCount * colors.length),
    colors.length - 1
  );
  
  // Convertir RGB a hexadecimal
  const [r, g, b] = colors[index];
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Obtiene color basado en el tipo de ataque
 * @param attackType Tipo de ataque (SSH, HTTP, etc.)
 * @returns Color en formato hexadecimal
 */
export const getAttackTypeColor = (attackType: string): string => {
  const type = attackType.toLowerCase();
  
  const colorMap: Record<string, string> = {
    'ssh': '#ef4444',     // Rojo
    'http': '#3b82f6',    // Azul
    'https': '#8b5cf6',   // Púrpura
    'ftp': '#22c55e',     // Verde
    'telnet': '#f97316',  // Naranja
    'rdp': '#ec4899',     // Rosa
    'smtp': '#14b8a6',    // Turquesa
    'dns': '#eab308',     // Amarillo
    'icmp': '#64748b',    // Gris
    'ntp': '#6366f1',     // Indigo
    'snmp': '#0ea5e9',    // Celeste
    'sql': '#f43f5e',     // Rojo claro
    'smb': '#84cc16',     // Lima
    'default': '#94a3b8'  // Gris claro
  };
  
  return colorMap[type] || colorMap['default'];
};

/**
 * Convierte un código de país de dos letras a un emoji de bandera
 * @param countryCode Código ISO del país (2 letras)
 * @returns Emoji de la bandera del país
 */
export const getFlagEmoji = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) {
    return '🏳️'; // Bandera neutral para códigos inválidos
  }
  
  // El emoji de una bandera está compuesto por dos letras regionales
  // que corresponden a los "regional indicator symbols"
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
};

/**
 * Devuelve la clase CSS para el indicador de severidad
 * @param severity Nivel de severidad ('critical', 'high', 'medium', 'low')
 * @returns Clase CSS para el nivel de severidad
 */
export const getSeverityClass = (severity: string): string => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'bg-red-600';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

/**
 * Agrupa los datos de ataques por país
 * @param attacks Array de objetos de ataques
 * @returns Objeto con conteo por país
 */
export const getAttacksByCountry = (attacks: any[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  attacks.forEach(attack => {
    if (attack.countryCode) {
      counts[attack.countryCode] = (counts[attack.countryCode] || 0) + 1;
    }
  });
  
  return counts;
};

/**
 * Crea un icono personalizado para Leaflet
 * @param color Color del icono en formato hexadecimal
 * @param size Tamaño del icono en píxeles
 * @returns Objeto de icono de Leaflet
 */
export const createCustomIcon = (color: string, size: number = 10): L.DivIcon => {
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 1px solid #fff;
      opacity: 0.8;
    "></div>`,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

/**
 * Crea un icono de flecha para líneas de ataque
 * @param color Color de la flecha
 * @param direction Dirección de la flecha en grados (0-360)
 * @returns Objeto de icono de Leaflet
 */
export const createArrowIcon = (color: string, direction: number = 0): L.DivIcon => {
  return L.divIcon({
    html: `<div style="
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 10px solid ${color};
      transform: rotate(${direction}deg);
    "></div>`,
    className: 'arrow-icon',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  });
};

/**
 * Crea puntos para una línea curva entre dos puntos geográficos
 * @param start Coordenadas de inicio [lat, lng]
 * @param end Coordenadas de fin [lat, lng]
 * @param intensity Factor de curvatura (0-1)
 * @param numPoints Número de puntos para la curva
 * @returns Array de coordenadas para crear la línea curva
 */
export const createCurvedLine = (
  start: [number, number],
  end: [number, number],
  intensity: number = 0.3,
  numPoints: number = 10
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