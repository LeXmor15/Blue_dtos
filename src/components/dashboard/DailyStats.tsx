// src/components/dashboard/DailyStats.tsx
import React from 'react';
import { DailyStats as DailyStatsType } from '../../types/dashboard';

interface DailyStatsProps {
  stats: DailyStatsType;
  date: Date;
}

const DailyStats: React.FC<DailyStatsProps> = ({ stats, date }) => {
  // Formatear fecha para mostrar
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      <h2 className="font-bold text-sm md:text-base mb-2">
        Estadísticas para {formatDate(date)}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-xs text-blue-600 mb-1">Total Ataques</div>
          <div className="text-xl font-bold">{stats.totalAttacks}</div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-xs text-green-600 mb-1">Ataques Bloqueados</div>
          <div className="text-xl font-bold">{stats.blockedAttacks}</div>
        </div>
        
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-xs text-red-600 mb-1">Alertas Críticas</div>
          <div className="text-xl font-bold">{stats.criticalAlerts}</div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-xs text-purple-600 mb-1">Usuarios Activos</div>
          <div className="text-xl font-bold">{stats.activeUsers}</div>
        </div>
      </div>
    </div>
  );
};

export default DailyStats;