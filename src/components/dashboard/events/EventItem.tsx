// src/components/dashboard/events/EventItem.tsx
import React from 'react';

interface EventItemProps {
  ip: string;
  region: string;
  time: string;
  countryCode: string;
}

const EventItem: React.FC<EventItemProps> = ({ ip, region, time, countryCode }) => {
  // Función para obtener emoji de bandera según código de país
  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode) return '';

    // Convertir código de país a mayúsculas
    const codePoints = Array.from(countryCode.toUpperCase())
      .map(char => 127397 + char.charCodeAt(0));

    // Crear emoji de bandera a partir de símbolos indicadores regionales
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="flex items-center p-2 hover:bg-gray-50">
      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
        {getFlagEmoji(countryCode)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm md:text-base truncate">{ip}</div>
        <div className="text-xs text-gray-500">{region}</div>
      </div>
      <div className="text-xs text-gray-500 ml-2">{time}</div>
    </div>
  );
};

export default EventItem;