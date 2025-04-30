// src/components/layout/DashboardLayout.tsx
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Chatbot from '../chatbot/Chatbot';

// Importa tus imágenes SVG (asegúrate de tener las rutas correctas)
import logo from '../../assets/logoSidebar.svg';
import homeIcon from '../../assets/home.svg';
import pipelinesIcon from '../../assets/pipelines.svg';
import servicesIcon from '../../assets/services.svg';
import logoutIcon from '../../assets/logout.svg';
import inboxIcon from '../../assets/inbox.svg';
import settingsIcon from '../../assets/settings.svg';

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
<div className="flex h-screen bg-[#f5f7fa] overflow-x-hidden">
      {/* Sidebar - Responsive */}
      <div className="fixed md:relative w-[70px] md:w-[200px] lg:w-[240px] h-full bg-white flex flex-col items-center justify-between p-1 md:p-4 shadow-md z-10">
        {/* Logo section */}
        <div className="text-center mb-3 w-full">
          <img src={logo} alt="Logo" className="w-[58%] mx-auto hidden md:block" />
          <img src={logo} alt="Logo" className="w-[40px] mx-auto md:hidden" />
        </div>
        
        {/* Navigation links */}
        <ul className="nav flex flex-col items-center justify-center mb-auto w-full space-y-1">
          <li className="w-full flex justify-center">
            <Link 
              to="/dashboard" 
              className={`flex items-center px-2 md:px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-100 ${
                isActive('/dashboard') ? 'text-[#425ebb] font-medium' : 'text-black'
              }`}
            >
              <img src={homeIcon} alt="Home" className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] md:mr-3 flex-shrink-0" />
              <span className="hidden md:inline text-sm lg:text-base whitespace-nowrap">Home</span>
            </Link>
          </li>
          <li className="w-full flex justify-center">
            <Link 
              to="/pipelines" 
              className={`flex items-center px-2 md:px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-100 ${
                isActive('/pipelines') ? 'text-[#425ebb] font-medium' : 'text-black'
              }`}
            >
              <img src={pipelinesIcon} alt="Pipelines" className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] md:mr-3 flex-shrink-0" />
              <span className="hidden md:inline text-sm lg:text-base whitespace-nowrap">Pipelines</span>
            </Link>
          </li>
          <li className="w-full flex justify-center">
            <Link 
              to="/services" 
              className={`flex items-center px-2 md:px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-100 ${
                isActive('/services') ? 'text-[#425ebb] font-medium' : 'text-black'
              }`}
            >
              <img src={servicesIcon} alt="Services" className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] md:mr-3 flex-shrink-0" />
              <span className="hidden md:inline text-sm lg:text-base whitespace-nowrap">Services</span>
            </Link>
          </li>
          <li className="w-full">
            <button 
              onClick={logout}
              className="flex items-center justify-center w-full px-2 md:px-4 py-2 rounded-md text-black hover:bg-gray-100 transition-all duration-200"
            >
              <img src={logoutIcon} alt="Logout" className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] md:mr-3 flex-shrink-0" />
              <span className="hidden md:inline text-sm lg:text-base whitespace-nowrap">Log out</span>
            </button>
          </li>
        </ul>
        
        {/* Contact box - Responsive */}
        <div className="hidden md:block bg-[#3498db] w-[124px] h-[144px] rounded-lg p-4 text-white mt-auto mb-4 shadow-md">
          <div className="flex flex-col items-center justify-center h-full">
            <img src={inboxIcon} alt="Contact" className="w-6 h-6 mb-2" />
            <span className="text-white text-sm font-medium mb-2">Contact now</span>
            <button className="bg-white text-[#3498db] text-xs py-1 px-2 rounded w-[100px]">
              Contact Support
            </button>
          </div>
        </div>
        
        {/* Mobile contact button */}
        <div className="md:hidden">
          <button className="p-1.5 rounded-full bg-[#3498db] text-white">
            <img src={inboxIcon} alt="Contact" className="w-4 h-4" />
          </button>
        </div>
        
        {/* Config section */}
        <div className="flex items-center justify-center w-full">
          <button className="flex items-center text-black p-2">
            <img src={settingsIcon} alt="Settings" className="w-[15px] h-[15px] md:mr-2" />
            <span className="hidden md:inline text-sm">Configuration</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 w-[calc(100%-60px)] md:w-[calc(100%-200px)] lg:w-[calc(100%-240px)] ml-[60px] md:ml-0">
        {/* Header */}
        <header className="bg-white flex justify-between items-center py-2 md:py-3 px-2 md:px-4 shadow-sm">
          <h1 className="font-bold text-base md:text-lg">BLUE AGENT PANEL</h1>
          
          <div className="flex space-x-2 md:space-x-4">
            <button className="p-1">
              <img src={settingsIcon} alt="Settings" className="w-[20px] md:w-[25px] h-[20px] md:h-[25px]" />
            </button>
            <button className="p-1">
              <div className="w-[20px] md:w-[25px] h-[20px] md:h-[25px] bg-gray-300 rounded-full"></div>
            </button>
          </div>
        </header>
        
        {/* Page content */}
        <div className="overflow-y-auto bg-[#f5f7fa] p-2 md:p-4 h-[calc(100vh-56px)] md:h-[calc(100vh-64px)]">
          {children}
        </div>
      </div>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default DashboardLayout;