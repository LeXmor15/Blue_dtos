// src/components/dashboard/EventsTable.tsx
import React from 'react';
import { AttackEvent } from '../../types/dashboard';
import { getFlagEmoji, getSeverityClass } from '../../utils/mapUtils';

interface EventsTableProps {
  events: AttackEvent[];
  maxRows?: number;
}

const EventsTable: React.FC<EventsTableProps> = ({ events, maxRows = 5 }) => {
  return (
    <div className="p-2 overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="grid grid-cols-6 gap-1 text-xs text-white">
          <div className="p-1 font-medium">Severity</div>
          <div className="p-1 font-medium">Source</div>
          <div className="p-1 font-medium hidden sm:block">Target</div>
          <div className="p-1 font-medium hidden sm:block">Protocol</div>
          <div className="p-1 font-medium">Timestamp</div>
          <div className="p-1 font-medium">Type</div>
          
          {events.slice(0, maxRows).map((event) => (
            <React.Fragment key={event.id}>
              <div className="p-1 flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${getSeverityClass(event.severity)}`}></div>
              </div>
              <div className="p-1 flex items-center text-xs md:text-sm">
                <span className="mr-2">{getFlagEmoji(event.countryCode)}</span>
                <span className="truncate">{event.sourceIp}</span>
              </div>
              <div className="p-1 flex items-center hidden sm:flex">
                <span className="mr-2">🇳🇱</span>
                <span className="truncate">{event.destinationIp}</span>
              </div>
              <div className="p-1 hidden sm:block">{event.attackType}</div>
              <div className="p-1 text-xs md:text-sm">
                {new Date(event.timestamp).toLocaleTimeString()}
              </div>
              <div className="p-1 truncate">{event.attackType.toUpperCase()}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsTable;