// src/components/dashboard/services/ServicesList.tsx
import React from 'react';
import ServiceItem from './ServiceItem';
import { Service } from '../../../types/dashboard';

interface ServicesListProps {
  services: Service[];
}

const ServicesList: React.FC<ServicesListProps> = ({ services }) => {
  return (
    <div>
      <h2 className="font-medium mb-4">Services</h2>
      
      <div className="services-boxes">
        {services.map((service, index) => (
          <ServiceItem 
            key={index}
            name={service.name}
            description={service.description}
            status={service.status}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesList;