// src/components/dashboard/TabNavigation.tsx
import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-4">
      <div className="border-b border-gray-200">
        <ul className="flex">
          <li className="mr-1">
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'realtime' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => onTabChange('realtime')}
            >
              Real Time
            </button>
          </li>
          <li className="mr-1">
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'alerts' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => onTabChange('alerts')}
            >
              Alerts
            </button>
          </li>
          <li className="mr-1">
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => onTabChange('reports')}
            >
              Reports
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TabNavigation;