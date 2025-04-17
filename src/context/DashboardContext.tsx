// src/context/DashboardContext.tsx (Adaptado para Leaflet)
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAttackData } from '../hooks/useAttackData';
import { 
  AttackEvent, 
  LastEvent, 
  AttackLine, 
  ActivityData, 
  DailyStats,
  CalendarEvent,
  Service
} from '../types/dashboard';

interface DashboardContextType {
  attackEvents: AttackEvent[];
  lastEvents: LastEvent[];
  attackLines: AttackLine[];
  filteredAttackLines: AttackLine[];
  activityData: ActivityData[];
  dailyStats: DailyStats;
  calendarEvents: CalendarEvent[];
  services: Service[];
  isLoading: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addAttackLine: (attack: AttackEvent) => void;
  applyFilters: (filtered: AttackLine[]) => void;
  autoRefresh: boolean;
  toggleAutoRefresh: () => void;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const attackData = useAttackData(10000); // Actualizar cada 10 segundos

  const value: DashboardContextType = {
    attackEvents: attackData.attackEvents,
    lastEvents: attackData.lastEvents,
    attackLines: attackData.attackLines,
    filteredAttackLines: attackData.filteredAttackLines,
    activityData: attackData.activityData,
    dailyStats: attackData.dailyStats,
    calendarEvents: attackData.calendarEvents,
    services: attackData.services,
    isLoading: attackData.isLoading,
    selectedDate: attackData.selectedDate,
    setSelectedDate: attackData.setSelectedDate,
    addAttackLine: attackData.addAttackLine,
    applyFilters: attackData.applyFilters,
    autoRefresh: attackData.autoRefresh,
    toggleAutoRefresh: attackData.toggleAutoRefresh,
    refreshData: attackData.refreshData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};