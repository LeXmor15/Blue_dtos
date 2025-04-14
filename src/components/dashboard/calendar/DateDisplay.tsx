// src/components/dashboard/calendar/DateDisplay.tsx
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalendarEvent } from '../../../types/dashboard';
import '../../../styles/calendar.css'; // Usar los estilos existentes

interface DateDisplayProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  calendarEvents?: CalendarEvent[];
}

const DateDisplay: React.FC<DateDisplayProps> = ({ 
  selectedDate, 
  onDateChange,
  calendarEvents = []
}) => {
  // Función para comprobar si una fecha tiene eventos
  const hasEvents = (date: Date): boolean => {
    return calendarEvents.some(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Función para personalizar la clase de las celdas del calendario
  const tileClassName = ({ date, view }: { date: Date; view: string }): string => {
    if (view !== 'month') return '';
    
    const classes = [];
    
    // Comprobar si la fecha tiene eventos
    if (hasEvents(date)) {
      classes.push('has-events');
    }
    
    return classes.join(' ');
  };

  return (
    <div className="mb-6">
      <h2 className="font-medium mb-2">Date</h2>
      
      {/* Fecha grande en formato "5 nov 2024" */}
      <div className="current-date-display text-xl font-bold mb-4">
        {selectedDate.getDate()} {selectedDate.toLocaleString('default', { month: 'short' })} {selectedDate.getFullYear()}
      </div>
      
      <div className="calendar-box">
        <Calendar
          onChange={(value) => {
            // Verificar si es un array o un solo valor y manejar ambos casos
            if (Array.isArray(value)) {
              if (value[0]) {
                onDateChange(value[0]); // Usar la primera fecha si es un array
              }
            } else {
              if (value) {
                onDateChange(value as Date);
              }
            }
          }}
          value={selectedDate}
          className="custom-calendar"
          formatShortWeekday={(locale, date) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]}
          navigationLabel={({ date }) => ''}
          nextLabel={<span>›</span>}
          prevLabel={<span>‹</span>}
          tileClassName={tileClassName}
        />
      </div>
    </div>
  );
};

export default DateDisplay;