// src/hooks/useCalendar.ts
import { useState, useCallback } from 'react';
import { Day, CalendarEvent } from '../types/dashboard';
import { isSameDay } from '../utils/dateUtils';

interface UseCalendarReturn {
  currentMonth: Date;
  selectedDate: Date;
  calendarGrid: Day[][];
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  handleDayClick: (day: Day) => void;
  setSelectedDate: (date: Date) => void;
}

export const useCalendar = (
  initialDate: Date,
  events: CalendarEvent[] = [],
  onDateChange?: (date: Date) => void
): UseCalendarReturn => {
  const [currentMonth, setCurrentMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [selectedDate, setSelectedDateInternal] = useState(initialDate);

  // Cambiar al mes anterior
  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  }, []);

  // Cambiar al mes siguiente
  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  }, []);

  // Manejar el cambio de fecha
  const setSelectedDate = useCallback((date: Date) => {
    setSelectedDateInternal(date);
    if (onDateChange) {
      onDateChange(date);
    }
  }, [onDateChange]);

  // Generar la matriz del calendario
  const generateCalendarGrid = useCallback((): Day[][] => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Ajuste para empezar en lunes
    
    const grid: Day[][] = [];
    let currentWeek: Day[] = [];
    
    // Llenar celdas vacías para días del mes anterior
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      const day = prevMonthDays - startingDayOfWeek + i + 1;
      currentWeek.push({ 
        date: day, 
        isCurrentMonth: false 
      });
    }
    
    // Llenar días del mes actual
    const today = new Date();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const isToday = 
        today.getDate() === i && 
        today.getMonth() === month && 
        today.getFullYear() === year;
      
      // Comprobar si el día tiene eventos
      const hasEvents = events.some(event => isSameDay(event.date, currentDate));
      
      currentWeek.push({ 
        date: i, 
        isCurrentMonth: true,
        isToday,
        hasEvents
      });
      
      if (currentWeek.length === 7) {
        grid.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Llenar días restantes con el próximo mes
    if (currentWeek.length > 0) {
      const remainingDays = 7 - currentWeek.length;
      for (let i = 0; i < remainingDays; i++) {
        currentWeek.push({ date: i + 1, isCurrentMonth: false });
      }
      grid.push(currentWeek);
    }
    
    return grid;
  }, [currentMonth, events]);

  // Seleccionar un día
  const handleDayClick = useCallback((day: Day) => {
    if (!day.isCurrentMonth) {
      // Si se hace clic en un día de otro mes, cambiamos al mes correspondiente
      const newMonth = day.date > 15 
        ? currentMonth.getMonth() - 1 
        : currentMonth.getMonth() + 1;
      
      const newDate = new Date(
        currentMonth.getFullYear(),
        newMonth,
        day.date
      );
      
      setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
      setSelectedDate(newDate);
    } else {
      const newDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day.date
      );
      setSelectedDate(newDate);
    }
  }, [currentMonth, setSelectedDate]);

  const calendarGrid = generateCalendarGrid();

  return {
    currentMonth,
    selectedDate,
    calendarGrid,
    goToPreviousMonth,
    goToNextMonth,
    handleDayClick,
    setSelectedDate
  };
};