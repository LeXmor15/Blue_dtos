// src/components/dashboard/ActivityChart.tsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ActivityData } from '../../types/dashboard';

interface ActivityChartProps {
  data: ActivityData[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  const [showAttacks, setShowAttacks] = useState(true);
  const [showSources, setShowSources] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-bold text-sm md:text-base mb-4">Activity</h2>
      
      <div className="flex justify-end mb-2">
        <div className="inline-flex bg-gray-100 rounded-full px-2 py-1 text-xs">
          <button 
            className={`px-2 py-1 rounded-full whitespace-nowrap ${showAttacks && !showSources ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            onClick={() => { setShowAttacks(true); setShowSources(false); }}
          >
            •&nbsp;Attacks
          </button>
          <button 
            className={`px-2 py-1 rounded-full whitespace-nowrap ${!showAttacks && showSources ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            onClick={() => { setShowAttacks(false); setShowSources(true); }}
          >
            •&nbsp;Unique sources
          </button>
          <button 
            className={`px-2 py-1 rounded-full whitespace-nowrap ${showAttacks && showSources ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            onClick={() => { setShowAttacks(true); setShowSources(true); }}
          >
            •&nbsp;Both
          </button>
        </div>
      </div>
      
      <div className="h-32 md:h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            {showAttacks && (
              <Line 
                type="monotone" 
                dataKey="attacks" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6 }}
              />
            )}
            {showSources && (
              <Line 
                type="monotone" 
                dataKey="sources" 
                stroke="#5eead4" 
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;