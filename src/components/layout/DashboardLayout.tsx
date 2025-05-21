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
    <div className="flex flex-col md:flex-row h-screen bg-[#f5f7fa] overflow-hidden">
      {/* Sidebar - Desktop: Vertical en lado izquierdo */}
      <div className="hidden md:flex md:w-[200px] lg:w-[240px] h-full bg-white flex-col items-center justify-between p-4 shadow-md z-10">
        {/* Logo section */}
        <div className="text-center mb-3 w-full">
          <img src={logo} alt="Logo" className="w-[88%] mx-auto" />
        </div>
        
        {/* Navigation links */}
        <ul className="nav flex flex-col mb-auto w-full space-y-4">
          <li className="w-full">
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
          <li className="w-full">
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
          <li className="w-full">
            <Link 
              to="/services" 
              className="flex items-center px-4 py-2 rounded-md text-black"
            >
              <img src={servicesIcon} alt="Services" className="w-[15px] h-[15px] mr-2" />
              <span>Services</span>
            </Link>
          </li>
          <li className="w-full">
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
          <Link to="/configuration" className="flex items-center text-black">
            <img src={settingsIcon} alt="Settings" className="w-[15px] h-[15px] mr-2" />
            <span className="text-sm">Configuration</span>
          </Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white flex justify-between items-center py-3 px-4 shadow-sm">
          <h1 className="font-bold text-lg">BLUE AGENT PANEL</h1>
          
          <div className="flex space-x-4">
            <Link to="/settings" className="p-1">
              <img src={settingsIcon} alt="Settings" className="w-[25px] h-[25px]" />
            </Link>
            <button className="p-1">
              <div className="w-[25px] h-[25px] bg-gray-300 rounded-full"></div>
            </button>
          </div>
        </header>
        
        {/* Page content - Ajustado para dejar espacio para la barra inferior en móvil */}
        <div className="overflow-y-auto bg-[#f5f7fa] p-4 h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] pb-16 md:pb-4">
          {children}
        </div>
      </div>
      
      {/* Bottom Navigation Bar - Solo visible en móvil */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white h-16 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around items-center px-2">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center justify-center ${isActive('/dashboard') ? 'text-[#425ebb]' : 'text-gray-500'}`}
        >
          <img 
            src={homeIcon} 
            alt="Home" 
            className={`w-6 h-6 ${isActive('/dashboard') ? 'opacity-100' : 'opacity-70'}`} 
          />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/pipelines" 
          className={`flex flex-col items-center justify-center ${isActive('/pipelines') ? 'text-[#425ebb]' : 'text-gray-500'}`}
        >
          <img 
            src={pipelinesIcon} 
            alt="Pipelines" 
            className={`w-6 h-6 ${isActive('/pipelines') ? 'opacity-100' : 'opacity-70'}`} 
          />
          <span className="text-xs mt-1">Pipelines</span>
        </Link>
        
        <Link 
          to="/services" 
          className={`flex flex-col items-center justify-center ${isActive('/services') ? 'text-[#425ebb]' : 'text-gray-500'}`}
        >
          <img 
            src={servicesIcon} 
            alt="Services" 
            className={`w-6 h-6 ${isActive('/services') ? 'opacity-100' : 'opacity-70'}`} 
          />
          <span className="text-xs mt-1">Services</span>
        </Link>
        
        <button 
          className="flex flex-col items-center justify-center text-gray-500"
          onClick={logout}
        >
          <img src={logoutIcon} alt="Logout" className="w-6 h-6 opacity-70" />
          <span className="text-xs mt-1">Log out</span>
        </button>
        
        <button className="w-10 h-10 rounded-full bg-[#3498db] flex items-center justify-center shadow-md">
          <img src={inboxIcon} alt="Contact" className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default DashboardLayout;