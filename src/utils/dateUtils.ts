// src/utils/dateUtils.ts

/**
 * Formatea una fecha para mostrarla en el formato "5 nov 2024"
 */
export const formatShortDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };
  
  /**
   * Formatea una fecha para usarla como clave en un objeto
   */
  export const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  /**
   * Obtiene el primer día del mes para una fecha determinada
   */
  export const getFirstDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };
  
  /**
   * Obtiene el último día del mes para una fecha determinada
   */
  export const getLastDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };
  
  /**
   * Comprueba si dos fechas son el mismo día
   */
  export const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };
  
  /**
   * Comprueba si una fecha está en un rango específico
   */
  export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
    const timestamp = date.getTime();
    return timestamp >= startDate.getTime() && timestamp <= endDate.getTime();
  };
  
  /**
   * Añade días a una fecha
   */
  export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  /**
   * Añade meses a una fecha
   */
  export const addMonths = (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  };