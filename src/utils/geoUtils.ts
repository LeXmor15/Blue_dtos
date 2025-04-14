// src/utils/geoUtils.ts
import { worldGeoJson } from '../components/dashboard/map/worldGeoJson';

/**
 * Carga un archivo GeoJSON desde una URL
 * @param url URL del archivo GeoJSON a cargar
 * @returns Promesa que resuelve al objeto GeoJSON
 */
export const loadGeoJson = async (url: string) => {
  try {
    console.log(`Intentando cargar GeoJSON desde: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error al cargar GeoJSON: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Verificar que el formato sea válido
    if (!data || data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
      throw new Error('Formato GeoJSON inválido');
    }
    
    console.log(`GeoJSON cargado exitosamente con ${data.features.length} features`);
    return data;
  } catch (error) {
    console.error('Error en loadGeoJson:', error);
    // En caso de error, devolver el GeoJSON por defecto
    console.log('Devolviendo GeoJSON por defecto');
    return worldGeoJson;
  }
};

/**
 * Valida que un objeto tenga estructura GeoJSON válida
 * @param data Objeto a validar
 * @returns Booleano indicando si es un GeoJSON válido
 */
export const isValidGeoJSON = (data: any): boolean => {
  if (!data || typeof data !== 'object') {
    console.error('GeoJSON inválido: datos nulos o no es un objeto');
    return false;
  }

  if (data.type !== 'FeatureCollection') {
    console.error('GeoJSON inválido: no es una FeatureCollection');
    return false;
  }

  if (!Array.isArray(data.features)) {
    console.error('GeoJSON inválido: features no es un array');
    return false;
  }

  if (data.features.length === 0) {
    console.error('GeoJSON inválido: features está vacío');
    return false;
  }

  // Verificar que al menos algunas features tienen geometrías válidas
  interface GeoJSONGeometry {
    type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';
    coordinates: any[];
  }

  interface GeoJSONFeature {
    type: 'Feature';
    geometry: GeoJSONGeometry;
  }

  const validFeatures: GeoJSONFeature[] = data.features.filter((feature: any): feature is GeoJSONFeature => 
    feature && 
    feature.type === 'Feature' && 
    feature.geometry && 
    ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'].includes(feature.geometry.type) &&
    Array.isArray(feature.geometry.coordinates)
  );

  if (validFeatures.length === 0) {
    console.error('GeoJSON inválido: no contiene features con geometrías válidas');
    return false;
  }

  return true;
};

/**
 * Simplifica un GeoJSON para mejorar el rendimiento reduciendo puntos
 * @param geoJson GeoJSON a simplificar
 * @param tolerance Tolerancia de simplificación (mayor valor = más simplificación)
 * @returns GeoJSON simplificado
 */
export const simplifyGeoJson = (geoJson: any, tolerance: number = 0.01): any => {
  // Esta es una implementación básica. Para una simplificación real,
  // se recomienda usar una biblioteca como Turf.js
  
  if (!isValidGeoJSON(geoJson)) {
    return worldGeoJson;
  }
  
  // Por simplicidad, solo devolvemos el mismo GeoJSON
  // En una implementación real, aquí se aplicaría un algoritmo como Douglas-Peucker
  return geoJson;
};

/**
 * Obtiene las estadísticas básicas de un GeoJSON
 * @param geoJson GeoJSON a analizar
 * @returns Objeto con estadísticas del GeoJSON
 */
export const getGeoJsonStats = (geoJson: any) => {
  if (!isValidGeoJSON(geoJson)) {
    return { features: 0, valid: false };
  }
  
  const featureTypes = new Map();
  let totalCoordinates = 0;
  
  geoJson.features.forEach((feature: any) => {
    if (feature.geometry && feature.geometry.type) {
      // Contar tipos de features
      const type = feature.geometry.type;
      featureTypes.set(type, (featureTypes.get(type) || 0) + 1);
      
      // Contar coordenadas (aproximación)
      if (type === 'Point') {
        totalCoordinates += 1;
      } else if (type === 'LineString' || type === 'MultiPoint') {
        totalCoordinates += feature.geometry.coordinates.length;
      } else if (type === 'Polygon' || type === 'MultiLineString') {
        feature.geometry.coordinates.forEach((ring: any) => {
          totalCoordinates += ring.length;
        });
      } else if (type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((polygon: any) => {
          polygon.forEach((ring: any) => {
            totalCoordinates += ring.length;
          });
        });
      }
    }
  });
  
  // Convertir el Map a un objeto regular para facilitar su uso
  const typeCounts: Record<string, number> = {};
  featureTypes.forEach((count, type) => {
    typeCounts[type] = count;
  });
  
  return {
    features: geoJson.features.length,
    valid: true,
    featureTypes: typeCounts,
    totalCoordinates,
    avgCoordinatesPerFeature: totalCoordinates / geoJson.features.length
  };
};

/**
 * Obtiene las coordenadas del centro aproximado del GeoJSON
 * @param geoJson GeoJSON a analizar
 * @returns Coordenadas [lon, lat] del centro
 */
export const getGeoJsonCenter = (geoJson: any): [number, number] => {
  if (!isValidGeoJSON(geoJson)) {
    return [0, 0]; // Centro predeterminado
  }
  
  // Cálculo simplificado que no tiene en cuenta la curvatura de la Tierra
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  
  // Función recursiva para extraer todas las coordenadas
  const processCoordinates = (coords: any) => {
    if (Array.isArray(coords) && coords.length === 2 && 
        typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      // Es un punto [lon, lat]
      const [lon, lat] = coords;
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    } else if (Array.isArray(coords)) {
      // Es un array de coordenadas o de arrays
      coords.forEach(c => processCoordinates(c));
    }
  };
  
  // Procesar todas las geometrías
  geoJson.features.forEach((feature: any) => {
    if (feature.geometry && feature.geometry.coordinates) {
      processCoordinates(feature.geometry.coordinates);
    }
  });
  
  // Calcular el centro como punto medio del bounding box
  if (minLon === Infinity || minLat === Infinity) {
    return [0, 0]; // No se encontraron coordenadas válidas
  }
  
  return [(minLon + maxLon) / 2, (minLat + maxLat) / 2];
};