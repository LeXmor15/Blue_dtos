// src/components/layout/DashboardLayout.tsx
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Chatbot from '../chatbot/Chatbot';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 bg-black text-white flex flex-col items-center pt-5 pb-5">
        <div className="mb-10">
          {/* Logo placeholder - you'll add your SVG */}
          <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center">
            <div className="text-black font-bold text-xl">B</div>
          </div>
          <div className="text-center text-xs mt-1">Boreal</div>
          <div className="text-center text-xs">security</div>
        </div>
        
        <div className="flex flex-col gap-6 items-center flex-grow">
          <Link 
            to="/dashboard" 
            className={`w-full flex flex-col items-center ${isActive('/dashboard') ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <div className="w-6 h-6 mb-1">🏠</div>
            <span className="text-xs">Home</span>
          </Link>
          
          <Link 
            to="/pipelines" 
            className={`w-full flex flex-col items-center ${isActive('/pipelines') ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <div className="w-6 h-6 mb-1">🔄</div>
            <span className="text-xs">Pipelines</span>
          </Link>
          
          <button className="w-full flex flex-col items-center text-gray-400">
            <div className="w-6 h-6 mb-1">⚙️</div>
            <span className="text-xs">Services</span>
          </button>
          
          <button 
            onClick={logout}
            className="w-full flex flex-col items-center text-gray-400 mt-auto"
          >
            <div className="w-6 h-6 mb-1">🚪</div>
            <span className="text-xs">Log out</span>
          </button>
        </div>
        
        <div className="mt-auto">
          <button className="w-full flex flex-col items-center text-gray-400">
            <div className="w-6 h-6 mb-1">⚙️</div>
            <span className="text-xs">Configuration</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center h-14 px-4 bg-white border-b border-gray-200">
          <h1 className="font-bold text-lg">BLUE AGENT PANEL</h1>
          
          <div className="flex space-x-2">
            <button className="p-2 text-gray-600">⚙️</button>
            <button className="p-2 text-gray-600">👤</button>
          </div>
        </header>
        
        {/* Page content */}
        <div className="h-[calc(100vh-56px)] overflow-auto">
          {children}
        </div>
      </div>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default DashboardLayout;