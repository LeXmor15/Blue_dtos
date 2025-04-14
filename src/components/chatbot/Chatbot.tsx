// src/components/chatbot/Chatbot.tsx
import { useEffect } from 'react';
import { useChatbot } from '../../context/ChatbotContext';
import ChatButton from './ChatbotButton'; // Corregido: usar la misma importación que ya funciona
import ChatWindow from './ChatWindow';

// Para depuración
let isMounted = false;

const Chatbot = () => {
  const { isOpen, isMinimized } = useChatbot();

  // Para depuración
  useEffect(() => {
    console.log('🔧 Chatbot montado');
    
    if (isMounted) {
      console.warn('⚠️ ALERTA: Múltiples instancias de Chatbot detectadas');
    }
    
    isMounted = true;
    
    return () => {
      console.log('🔧 Chatbot desmontado');
      isMounted = false;
    };
  }, []);

  return (
    <>
      <ChatButton />
      {(isOpen && !isMinimized) && <ChatWindow />}
    </>
  );
};

export default Chatbot;