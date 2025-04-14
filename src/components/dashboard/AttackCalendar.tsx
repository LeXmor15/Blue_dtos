// src/components/dashboard/AttackCalendar.tsx
import React from 'react';
import DateDisplay from './calendar/DateDisplay';
import { CalendarEvent } from '../../types/dashboard';
import ServicesList from './services/ServicesList';
import { Service } from '../../types/dashboard';

interface AttackCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  calendarEvents: CalendarEvent[];
  services: Service[];
}

const AttackCalendar: React.FC<AttackCalendarProps> = ({ 
  selectedDate, 
  onDateChange, 
  calendarEvents,
  services
}) => {
  return (
    <div className="bg-white rounded-lg shadow w-full lg:w-1/3">
      <div className="calendar-container p-4 w-full max-w-full">
        {/* Calendario */}
        <DateDisplay 
          selectedDate={selectedDate} 
          onDateChange={onDateChange} 
          calendarEvents={calendarEvents}
        />
        
        {/* Lista de servicios */}
        <ServicesList services={services} />
      </div>
    </div>
  );
};

export default AttackCalendar;