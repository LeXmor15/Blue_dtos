// src/components/dashboard/calendar/CalendarDay.tsx
import React from 'react';
import { Day } from '../../../types/dashboard';

interface CalendarDayProps {
  day: Day;
  isSelected: boolean;
  onClick: (day: Day) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, isSelected, onClick }) => {
  return (
    <button
      onClick={() => onClick(day)}
      className={`
        relative flex items-center justify-center w-8 h-8 text-sm rounded-full
        transition-colors duration-200
        ${!day.isCurrentMonth ? 'text-gray-300' : ''}
        ${day.isToday ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
        ${isSelected && !day.isToday ? 'bg-blue-100 text-blue-800 font-medium' : ''}
        ${day.isCurrentMonth && !day.isToday && !isSelected ? 'hover:bg-gray-100' : ''}
      `}
    >
      {day.date}
      {day.hasEvents && (
        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
};

export default CalendarDay;