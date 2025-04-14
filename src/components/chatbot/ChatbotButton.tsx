// src/components/chatbot/ChatButton.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useChatbot } from '../../context/ChatbotContext';
import { MessageCircle } from 'lucide-react';

// Ajusta la ruta según la ubicación de tu archivo
import ChatbotIcon from '../../assets/Logo_Chatbot.svg';

const ChatButton: React.FC = () => {
  const { isOpen, openChat, messages, isMinimized, maximizeChat, position, updatePosition, markMessageAsRead } = useChatbot();
  
  // Estado para el arrastre
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Contador de mensajes no leídos (corregido)
  const unreadMessages = messages.filter(
    msg => msg.sender === 'bot' && (msg.isRead === false || msg.status !== 'read')
  ).length;
  
  // Marcar mensajes como leídos cuando se abre el chat
  useEffect(() => {
    if (isOpen && !isMinimized && unreadMessages > 0) {
      // Marcar todos los mensajes del bot como leídos
      messages.forEach(msg => {
        if (msg.sender === 'bot' && (msg.isRead === false || msg.status !== 'read')) {
          markMessageAsRead(msg.id);
        }
      });
    }
  }, [isOpen, isMinimized, messages, markMessageAsRead, unreadMessages]);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Prevenir que el clic para abrir el chat inicie un arrastre
    e.stopPropagation();
    
    if (isOpen && isMinimized) {
      maximizeChat();
    } else if (!isOpen) {
      openChat();
    }
    
    console.log('ChatButton click - Estado actual:', { isOpen, isMinimized });
  }, [isOpen, isMinimized, maximizeChat, openChat]);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    
    // Prevenir comportamiento por defecto
    e.preventDefault();
  }, [position.x, position.y]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calcular nueva posición
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Actualizar posición
    updatePosition(newX, newY);
  }, [isDragging, dragOffset.x, dragOffset.y, updatePosition]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
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
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  return (
    <motion.div
      ref={buttonRef}
      className="fixed z-50 cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={() => {}}  // Necesario para soporte móvil
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center overflow-hidden"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Usar tu imagen SVG personalizada */}
        <img
          src={ChatbotIcon}
          alt="Chatbot"
          className="w-full h-full object-cover"
        />
        
        {/* Badge para mensajes no leídos */}
        {unreadMessages > 0 && (
          <motion.div 
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {unreadMessages}
          </motion.div>
        )}
        
        {/* Efecto de pulso */}
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-500"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </motion.button>
    </motion.div>
  );
};

export default ChatButton;