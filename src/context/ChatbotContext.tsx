// src/context/ChatbotContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotContextType {
  isOpen: boolean;
  isMinimized: boolean;
  messages: Message[];
  position: { x: number; y: number };
  toggleChat: () => void;
  minimizeChat: () => void;
  sendMessage: (text: string) => void;
  updatePosition: (x: number, y: number) => void;
}

const defaultContext: ChatbotContextType = {
  isOpen: false,
  isMinimized: false,
  messages: [],
  position: { x: 0, y: 0 },
  toggleChat: () => {},
  minimizeChat: () => {},
  sendMessage: () => {},
  updatePosition: () => {},
};

export const ChatbotContext = createContext<ChatbotContextType>(defaultContext);

export const useChatbot = () => useContext(ChatbotContext);

interface ChatbotProviderProps {
  children: ReactNode;
}

const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hola, NombreUser, ¿qué te gustaría aprender hoy?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  // Por defecto posicionamos el chatbot en la esquina inferior derecha
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simular respuesta del bot después de un breve delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getRandomResponse(),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const updatePosition = (x: number, y: number) => {
    setPosition({ x, y });
  };

  // Respuestas simuladas del bot
  const getRandomResponse = () => {
    const responses = [
      'Puedo ayudarte con eso. ¿Qué más necesitas?',
      'Interesante pregunta. Déjame buscar más información al respecto.',
      'En Boreal Security, nos especializamos en ese tipo de soluciones.',
      '¿Has probado a revisar la documentación en nuestra web?',
      '¿Necesitas más detalles sobre alguna función específica?',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <ChatbotContext.Provider 
      value={{
        isOpen,
        isMinimized,
        messages,
        position,
        toggleChat,
        minimizeChat,
        sendMessage,
        updatePosition,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotProvider;





