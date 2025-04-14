// src/components/dashboard/services/ServiceItem.tsx
import React from 'react';

interface ServiceItemProps {
  name: string;
  description: string;
  status: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ name, description, status }) => {
  // Obtener la clase CSS y el ícono según el estado
  const getStatusClass = () => {
    switch (status) {
      case 'ok':
        return 'service-icon green';
      case 'warning':
        return 'service-icon yellow';
      case 'error':
        return 'service-icon red';
      default:
        return 'service-icon gray';
    }
  };

  // Obtener el icono SVG según el estado
  const getStatusIcon = () => {
    switch (status) {
      case 'ok':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5.5V8.5M8 11.5H8.01M3.07 13H12.93C14.03 13 14.76 11.82 14.23 10.89L9.27 2.47C8.74 1.53 7.26 1.53 6.73 2.47L1.77 10.89C1.24 11.82 1.97 13 3.07 13Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="2"/>
            <path d="M8 5.5V10.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="8" cy="12" r="1" fill="white"/>
          </svg>
        );
    }
  };

  return (
    <div className="service-box">
      <div className={getStatusClass()}>
        {getStatusIcon()}
      </div>
      <span className="service-subtext">{description}</span>
      <span className="service-text">{name}</span>
    </div>
  );
};

export default ServiceItem;