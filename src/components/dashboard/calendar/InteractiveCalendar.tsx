// src/components/dashboard/calendar/InteractiveCalendar.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent } from '../../../types/dashboard';
import { useCalendar } from '../../../hooks/useCalendar';
import CalendarDay from './CalendarDay';
import { formatShortDate } from '../../../utils/dateUtils';

import '../../../styles/dashboard.css';

interface InteractiveCalendarProps {
  date: Date;
  onChange: (date: Date) => void;
  events?: CalendarEvent[];
}

const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  date,
  onChange,
  events = []
}) => {
  const { 
    currentMonth,
    selectedDate,
    calendarGrid,
    goToPreviousMonth,
    goToNextMonth,
    handleDayClick,
  } = useCalendar(date, events, onChange);

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <div className="rounded-lg">
      {/* Header del mes y año con controles de navegación */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Mes anterior"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="text-xl font-bold">
          {formatShortDate(selectedDate)}
        </div>
        
        <button 
          onClick={goToNextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Mes siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 text-xs text-center mb-1">
        {weekDays.map((day) => (
          <div key={day} className="font-medium text-gray-500">{day}</div>
        ))}
      </div>
      
      {/* Días del calendario */}
      {calendarGrid.map((week, weekIndex) => (
        <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-1 mb-2">
          {week.map((day, dayIndex) => {
            // Determinar si este día está seleccionado
            const isSelected = 
              selectedDate.getDate() === day.date && 
              selectedDate.getMonth() === (day.isCurrentMonth ? currentMonth.getMonth() : 
                day.date > 15 ? currentMonth.getMonth() - 1 : currentMonth.getMonth() + 1) &&
              selectedDate.getFullYear() === currentMonth.getFullYear();
            
            return (
              <CalendarDay
                key={`day-${weekIndex}-${dayIndex}`}
                day={day}
                isSelected={isSelected}
                onClick={handleDayClick}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default InteractiveCalendar;