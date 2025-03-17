// src/context/ChatbotContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';
import { sendMessage as sendMessageToApi } from '../services/chatService';

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

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Llamada al servicio para obtener la respuesta del bot
      const botResponse = await sendMessageToApi(text);

      // Agregar mensaje del bot
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse, // Respuesta obtenida de la API (ya es un string)
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al obtener la respuesta del bot:', error);

      // Agregar mensaje de error del bot
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Lo siento, ocurrió un error al procesar tu solicitud.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };
  
  const updatePosition = (x: number, y: number) => {
    setPosition({ x, y });
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