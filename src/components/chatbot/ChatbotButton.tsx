// src/components/chatbot/ChatbotButton.tsx
import { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../../context/ChatbotContext';
// Importa tu SVG - ajusta la ruta según la ubicación de tu archivo
import ChatbotIcon from '../../assets/Logo_Chatbot.svg';

const ChatbotButton = () => {
  const { toggleChat, position, updatePosition } = useChatbot();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    
    // Prevenir comportamiento por defecto
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calcular nueva posición
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Actualizar posición
    updatePosition(newX, newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      // Agregar event listeners cuando se inicia el arrastre
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    // Limpiar event listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={buttonRef}
      className="fixed z-50 cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={() => {}}  // Necesario para soporte móvil
    >
      <button
        className="w-22 h-22 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        onClick={(e) => {
          // Prevenir que el clic para abrir el chat inicie un arrastre
          e.stopPropagation();
          toggleChat();
        }}
      >
        {/* Reemplaza el div circular con tu imagen SVG */}
        <img 
          src={ChatbotIcon} 
          alt="Chatbot" 
          className="w-full h-full rounded-full"
        />
      </button>
    </div>
  );
};

export default ChatbotButton;