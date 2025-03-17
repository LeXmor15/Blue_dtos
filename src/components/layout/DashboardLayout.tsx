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
    <div className="flex h-screen bg-[#f5f7fa]">
      {/* Sidebar - Emulando el estilo Bootstrap del CSS compartido */}
      <div className="w-[10%] fixed h-full bg-white flex flex-col items-center justify-between p-4 shadow-md z-10">
        {/* Logo section */}
        <div className="text-center mb-3 w-full">
          <img src={logo} alt="Logo" className="w-[88%] mx-auto" />
        </div>
        
        {/* Navigation links */}
        <ul className="nav flex flex-col mb-auto w-full">
          <li className="mb-2 w-full">
            <Link 
              to="/dashboard" 
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive('/dashboard') ? 'text-[#425ebb] font-medium' : 'text-black'
              }`}
            >
              <img src={homeIcon} alt="Home" className="w-[15px] h-[15px] mr-2" />
              <span>Home</span>
            </Link>
          </li>
          <li className="mb-2 w-full">
            <Link 
              to="/pipelines" 
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive('/pipelines') ? 'text-[#425ebb] font-medium' : 'text-black'
              }`}
            >
              <img src={pipelinesIcon} alt="Pipelines" className="w-[15px] h-[15px] mr-2" />
              <span>Pipelines</span>
            </Link>
          </li>
          <li className="mb-2 w-full">
            <button 
              className="flex items-center px-4 py-2 rounded-md text-black w-full text-left"
            >
              <img src={servicesIcon} alt="Services" className="w-[15px] h-[15px] mr-2" />
              <span>Services</span>
            </button>
          </li>
          <li className="mb-2 w-full">
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 rounded-md text-black w-full text-left"
            >
              <img src={logoutIcon} alt="Logout" className="w-[15px] h-[15px] mr-2" />
              <span>Log out</span>
            </button>
          </li>
        </ul>
        
        {/* Contact box - Emulando la caja azul del CSS */}
        <div className="bg-[#3498db] w-[124px] h-[144px] rounded-lg p-4 text-white mt-auto mb-4 shadow-md">
          <div className="flex flex-col items-center justify-center h-full">
            <img src={inboxIcon} alt="Contact" className="w-6 h-6 mb-2" />
            <span className="text-white text-sm font-medium mb-2">Contact now</span>
            <button className="bg-white text-[#3498db] text-xs py-1 px-2 rounded w-[100px]">
              Contact Support
            </button>
          </div>
        </div>
        
        {/* Config section */}
        <div className="flex items-center justify-center w-full">
          <button className="flex items-center text-black">
            
            <img src={settingsIcon} alt="Settings" className="w-[15px] h-[15px] mr-2" />
            <span className="text-sm">Configuration</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow ml-[180px]">
        {/* Header */}
        <header className="bg-white flex justify-between items-center py-3 px-4 shadow-sm">
          <h1 className="font-bold text-lg">BLUE AGENT PANEL</h1>
          
          <div className="flex space-x-4">
            <button className="p-1">
              <img src={settingsIcon} alt="Settings" className="headerIcon w-[25px] h-[25px]" />
            </button>
            <button className="p-1">
              <div className="w-[25px] h-[25px] bg-gray-300 rounded-full"></div>
            </button>
          </div>
        </header>
        
        {/* Page content */}
        <div className="overflow-y-auto bg-[#f5f7fa] p-4 h-[calc(100vh-64px)]">
          {children}
        </div>
      </div>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default DashboardLayout;