// src/utils/mapUtils.ts

/**
 * Proyección de coordenadas geográficas a coordenadas SVG (Mercator)
 * @param lon Longitud en grados decimales
 * @param lat Latitud en grados decimales
 * @param width Ancho del SVG
 * @param height Alto del SVG
 * @returns Coordenadas [x, y] para el SVG
 */
export const projectMercator = (
  lon: number, 
  lat: number, 
  width: number = 960, 
  height: number = 500
): [number, number] => {
  // Convertir a radianes
  const lambda = (lon * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  
  // Factor de escala
  const scale = width / (2 * Math.PI);
  
  // Proyección Mercator
  const x = scale * (lambda + Math.PI);
  
  // Ajuste para evitar valores infinitos cerca de los polos
  let y;
  if (Math.abs(lat) >= 85) {
    // Limitar latitudes extremas
    y = lat > 0 ? 0 : height;
  } else {
    y = scale * (Math.PI - Math.log(Math.tan(Math.PI / 4 + phi / 2)));
  }
  
  return [x, y];
};

/**
 * Proyección equirectangular (más simple pero menos precisa que Mercator)
 * @param lon Longitud en grados decimales
 * @param lat Latitud en grados decimales
 * @param width Ancho del SVG
 * @param height Alto del SVG
 * @returns Coordenadas [x, y] para el SVG
 */
export const projectEquirectangular = (
  lon: number, 
  lat: number, 
  width: number = 960, 
  height: number = 500
): [number, number] => {
  const x = (lon + 180) * (width / 360);
  const y = (90 - lat) * (height / 180);
  return [x, y];
};

/**
 * Crea un arco curvo entre dos puntos geográficos
 * @param source Coordenadas de origen [lon, lat]
 * @param destination Coordenadas de destino [lon, lat]
 * @param height Factor de curvatura (0-1)
 * @param width Ancho del SVG
 * @param height Alto del SVG
 * @returns String de path SVG para el arco
 */
export const createArc = (
  source: [number, number], 
  destination: [number, number], 
  curvature: number = 0.3,
  width: number = 960, 
  height: number = 500
): string => {
  // Proyectar coordenadas geográficas a SVG
  const [sourceX, sourceY] = projectMercator(source[0], source[1], width, height);
  const [destX, destY] = projectMercator(destination[0], destination[1], width, height);
  
  // Calcular la distancia entre puntos
  const dx = destX - sourceX;
  const dy = destY - sourceY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Punto de control para la curva (perpendicular a la línea que conecta los puntos)
  const midX = (sourceX + destX) / 2;
  const midY = (sourceY + destY) / 2 - dist * curvature; // Ajusta la curvatura
  
  // Devolver el path SVG
  return `M${sourceX},${sourceY} Q${midX},${midY} ${destX},${destY}`;
};

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