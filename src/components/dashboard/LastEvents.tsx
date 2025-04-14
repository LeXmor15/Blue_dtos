// src/components/dashboard/LastEvents.tsx
import React from 'react';
import { LastEvent } from '../../types/dashboard';
import { getFlagEmoji } from '../../utils/mapUtils';

interface LastEventsProps {
  events: LastEvent[];
}

const LastEvents: React.FC<LastEventsProps> = ({ events }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-bold text-sm md:text-base mb-4">Last Events</h2>
      
      <div className="space-y-2 md:space-y-4">
        {events.map((event, index) => (
          <div key={index} className="flex items-center p-2 hover:bg-gray-50">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              {getFlagEmoji(event.countryCode)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm md:text-base truncate">{event.ip}</div>
              <div className="text-xs text-gray-500">{event.region}</div>
            </div>
            <div className="text-xs text-gray-500 ml-2">{event.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LastEvents;