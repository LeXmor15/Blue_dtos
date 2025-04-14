// src/components/dashboard/map/worldGeoJson.ts
import { Feature, FeatureCollection, Geometry } from 'geojson';

// Interfaz para las propiedades de cada país
interface CountryProperties {
  name: string;
  iso_a2: string;
  iso_a3: string;
}

// Tipo para el GeoJSON completo con propiedades de país
export type WorldGeoJsonType = FeatureCollection<Geometry, CountryProperties>;

// Función para obtener el GeoJSON
export const fetchWorldGeoJson = async (): Promise<WorldGeoJsonType> => {
  try {
    // En un caso real, podrías cargar esto desde un endpoint o archivo local
    const response = await fetch('/api/world-geo-data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching world GeoJSON:', error);
    // Devolver un GeoJSON vacío en caso de error
    return {
      type: 'FeatureCollection',
      features: []
    };
  }
};

// Función para obtener el color de un país según la cantidad de ataques
export const getCountryColor = (
  countryCode: string, 
  attackCounts: Record<string, number>,
  darkMode: boolean = true
): string => {
  const count = attackCounts[countryCode] || 0;
  
  // Si no hay ataques, color base según el modo
  if (count === 0) {
    return darkMode ? '#0f172a' : '#e2e8f0';
  }
  
  // Paleta de colores para modo oscuro (azules)
  if (darkMode) {
    if (count < 5) return '#3b82f6'; // Azul claro - pocos ataques
    if (count < 20) return '#2563eb'; // Azul medio
    if (count < 50) return '#1d4ed8'; // Azul fuerte
    if (count < 100) return '#1e40af'; // Azul muy intenso
    return '#1e3a8a'; // Azul extremadamente intenso - muchísimos ataques
  } 
  // Paleta para modo claro (si se necesita en el futuro)
  else {
    if (count < 5) return '#93c5fd'; 
    if (count < 20) return '#60a5fa'; 
    if (count < 50) return '#3b82f6'; 
    if (count < 100) return '#2563eb'; 
    return '#1d4ed8'; 
  }
};

// Función para obtener el nombre completo de un país a partir de su código
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
    'VEN': 'Venezuela',
    'ECU': 'Ecuador',
    'BOL': 'Bolivia',
    'PRY': 'Paraguay',
    'URY': 'Uruguay',
    'GBR': 'Reino Unido',
    'DEU': 'Alemania',
    'FRA': 'Francia',
    'ESP': 'España',
    'ITA': 'Italia',
    'PRT': 'Portugal',
    'NLD': 'Países Bajos',
    'BEL': 'Bélgica',
    'CHE': 'Suiza',
    'AUT': 'Austria',
    'SWE': 'Suecia',
    'NOR': 'Noruega',
    'FIN': 'Finlandia',
    'DNK': 'Dinamarca',
    'POL': 'Polonia',
    'RUS': 'Rusia',
    'UKR': 'Ucrania',
    'TUR': 'Turquía',
    'GRC': 'Grecia',
    'CHN': 'China',
    'JPN': 'Japón',
    'KOR': 'Corea del Sur',
    'PRK': 'Corea del Norte',
    'IND': 'India',
    'PAK': 'Pakistán',
    'AUS': 'Australia',
    'NZL': 'Nueva Zelanda',
    'ZAF': 'Sudáfrica',
    'EGY': 'Egipto',
    'MAR': 'Marruecos',
    'DZA': 'Argelia',
    'NGA': 'Nigeria',
    'KEN': 'Kenia',
    'ETH': 'Etiopía',
    'SAU': 'Arabia Saudí',
    'IRN': 'Irán',
    'IRQ': 'Iraq',
    'ARE': 'Emiratos Árabes Unidos',
    'QAT': 'Qatar',
    'KWT': 'Kuwait',
    'ISR': 'Israel',
    'JOR': 'Jordania',
    'SYR': 'Siria',
    'LBN': 'Líbano',
    'MYS': 'Malasia',
    'IDN': 'Indonesia',
    'PHL': 'Filipinas',
    'THA': 'Tailandia',
    'VNM': 'Vietnam',
    'MMR': 'Myanmar',
  };
  
  return countryNames[code] || code;
};

// Función auxiliar para simplificar el GeoJSON (si es necesario para rendimiento)
export const simplifyGeoJson = (geoJson: WorldGeoJsonType, tolerance: number = 0.01): WorldGeoJsonType => {
  // Aquí podrías implementar un algoritmo como Douglas-Peucker para simplificar las geometrías
  // Para un entorno de producción, recomendaría usar una biblioteca como Turf.js
  
  // Por ahora, solo devolvemos el mismo GeoJSON
  return geoJson;
};

// GeoJSON minificado para tener algo por defecto
// Este es un GeoJSON muy básico con contornos de países simplificados
export const worldGeoJson: WorldGeoJsonType = {
  type: "FeatureCollection",
  features: [
    // Ejemplo básico con algunos países principales
    {
      type: "Feature",
      id: "USA",
      properties: { name: "United States", iso_a2: "US", iso_a3: "USA" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [[[-125, 48], [-125, 30], [-100, 30], [-100, 48], [-125, 48]]],
          [[[-85, 30], [-85, 25], [-80, 25], [-80, 30], [-85, 30]]]
        ]
      }
    },
    {
      type: "Feature",
      id: "CAN",
      properties: { name: "Canada", iso_a2: "CA", iso_a3: "CAN" },
      geometry: {
        type: "Polygon",
        coordinates: [[[-140, 70], [-140, 50], [-60, 50], [-60, 70], [-140, 70]]]
      }
    },
    {
      type: "Feature",
      id: "MEX",
      properties: { name: "Mexico", iso_a2: "MX", iso_a3: "MEX" },
      geometry: {
        type: "Polygon",
        coordinates: [[[-120, 30], [-120, 15], [-90, 15], [-90, 30], [-120, 30]]]
      }
    },
    {
      type: "Feature",
      id: "BRA",
      properties: { name: "Brazil", iso_a2: "BR", iso_a3: "BRA" },
      geometry: {
        type: "Polygon",
        coordinates: [[[-75, 5], [-75, -35], [-35, -35], [-35, 5], [-75, 5]]]
      }
    },
    {
      type: "Feature",
      id: "GBR",
      properties: { name: "United Kingdom", iso_a2: "GB", iso_a3: "GBR" },
      geometry: {
        type: "Polygon",
        coordinates: [[[-5, 50], [-5, 55], [2, 55], [2, 50], [-5, 50]]]
      }
    },
    {
      type: "Feature",
      id: "FRA",
      properties: { name: "France", iso_a2: "FR", iso_a3: "FRA" },
      geometry: {
        type: "Polygon",
        coordinates: [[[-5, 42], [-5, 50], [8, 50], [8, 42], [-5, 42]]]
      }
    },
    {
      type: "Feature",
      id: "DEU",
      properties: { name: "Germany", iso_a2: "DE", iso_a3: "DEU" },
      geometry: {
        type: "Polygon",
        coordinates: [[[6, 47], [6, 55], [15, 55], [15, 47], [6, 47]]]
      }
    },
    {
      type: "Feature",
      id: "RUS",
      properties: { name: "Russia", iso_a2: "RU", iso_a3: "RUS" },
      geometry: {
        type: "Polygon",
        coordinates: [[[30, 50], [30, 70], [180, 70], [180, 50], [30, 50]]]
      }
    },
    {
      type: "Feature",
      id: "CHN",
      properties: { name: "China", iso_a2: "CN", iso_a3: "CHN" },
      geometry: {
        type: "Polygon",
        coordinates: [[[75, 20], [75, 45], [135, 45], [135, 20], [75, 20]]]
      }
    },
    {
      type: "Feature",
      id: "IND",
      properties: { name: "India", iso_a2: "IN", iso_a3: "IND" },
      geometry: {
        type: "Polygon",
        coordinates: [[[70, 8], [70, 35], [90, 35], [90, 8], [70, 8]]]
      }
    },
    {
      type: "Feature",
      id: "AUS",
      properties: { name: "Australia", iso_a2: "AU", iso_a3: "AUS" },
      geometry: {
        type: "Polygon",
        coordinates: [[[115, -10], [115, -40], [155, -40], [155, -10], [115, -10]]]
      }
    }
  ]
};