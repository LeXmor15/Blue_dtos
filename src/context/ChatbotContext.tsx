import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { v4 as uuidv4 } from 'uuid';

// Tipos
type MessageType = {
id: string;
text: string;
sender: 'user' | 'bot';
timestamp: Date;
status?: 'sending' | 'sent' | 'read' | 'error';
isRead?: boolean; // Para compatibilidad con el anterior sistema
attachments?: Array<{
  type: 'image' | 'file' | 'audio';
  url: string;
  name?: string;
}>;
reactions?: {
  liked?: boolean;
  disliked?: boolean;
};
};

type Position = {
x: number;
y: number;
};

type ChatbotContextType = {
isOpen: boolean;
isMinimized: boolean;
messages: MessageType[];
position: Position;
openChat: () => void;
closeChat: () => void;
minimizeChat: () => void;
maximizeChat: () => void;
updatePosition: (x: number, y: number) => void;
sendMessage: (text: string, attachments?: Array<{ type: 'image' | 'file' | 'audio'; url: string; name?: string }>) => void;
deleteMessage: (id: string) => void;
clearChat: () => void;
markMessageAsRead: (id: string) => void;
reactToMessage: (id: string, reaction: 'like' | 'dislike') => void;
resendMessage: (id: string) => void;
getBotResponse: (userMessage: string) => Promise<string>;
};

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
const context = useContext(ChatbotContext);
if (context === undefined) {
  throw new Error('useChatbot debe ser usado dentro de un ChatbotProvider');
}
return context;
};

// Respuestas predefinidas del bot para simular inteligencia
const botResponses: Record<string, string[]> = {
default: [
  "¿En qué más puedo ayudarte?",
  "¿Necesitas información adicional sobre algo?",
  "Estoy aquí para ayudarte, ¿qué más necesitas?"
],
greeting: [
  "¡Hola! ¿En qué puedo ayudarte hoy?",
  "Bienvenido/a, soy el asistente virtual. ¿Cómo puedo asistirte?",
  "Hola, es un placer saludarte. ¿En qué puedo orientarte?"
],
thanks: [
  "¡De nada! Estoy aquí para ayudarte.",
  "Es un placer poder asistirte.",
  "No hay de qué. ¿Hay algo más en lo que pueda ayudarte?"
],
product: [
  "Tenemos una amplia gama de productos. ¿Hay alguna categoría específica que te interese?",
  "Nuestros productos están diseñados para ofrecer la mejor experiencia. ¿Quieres más detalles sobre alguno en particular?",
  "Puedo mostrarte nuestros productos más populares o los descuentos actuales. ¿Qué prefieres?"
]
};

// Servicio de generación de respuestas con IA
const generateBotResponse = async (userMessage: string): Promise<string> => {
// En un entorno real, aquí se conectaría con un servicio de IA
// Simulamos una pequeña latencia para hacerlo más realista
return new Promise((resolve) => {
  setTimeout(() => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Determinamos qué tipo de respuesta dar
    let responseCategory = 'default';
    
    if (lowerCaseMessage.includes('hola') || lowerCaseMessage.includes('saludos') || lowerCaseMessage.includes('buenos días')) {
      responseCategory = 'greeting';
    } else if (lowerCaseMessage.includes('gracias') || lowerCaseMessage.includes('agradecido')) {
      responseCategory = 'thanks';
    } else if (lowerCaseMessage.includes('producto') || lowerCaseMessage.includes('artículo') || lowerCaseMessage.includes('comprar')) {
      responseCategory = 'product';
    }
    
    // Seleccionamos una respuesta aleatoria de la categoría
    const responses = botResponses[responseCategory];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    resolve(randomResponse);
  }, 1000);
});
};

export const ChatbotProvider: React.FC<{ children: React.ReactNode; initialOpen?: boolean }> = ({ 
children, 
initialOpen = false 
}) => {
const [isOpen, setIsOpen] = useState(initialOpen);
const [isMinimized, setIsMinimized] = useState(false);
const [messages, setMessages] = useState<MessageType[]>([]);
const [position, setPosition] = useState({ x: window.innerWidth - 30, y: window.innerHeight - 30 });

// Función para actualizar la posición del botón
const updatePosition = useCallback((x: number, y: number) => {
  setPosition({ x, y });
  // Guardar la posición en localStorage
  localStorage.setItem('chatbotPosition', JSON.stringify({ x, y }));
}, []);

// Cargar posición guardada
useEffect(() => {
  const savedPosition = localStorage.getItem('chatbotPosition');
  if (savedPosition) {
    try {
      setPosition(JSON.parse(savedPosition));
    } catch (e) {
      console.error('Error al cargar posición guardada:', e);
    }
  }
}, []);

// Guardar mensajes en almacenamiento local cuando cambian
useEffect(() => {
  if (messages.length > 0) {
    // Convertimos las fechas a strings para poder guardarlas en localStorage
    const messagesToSave = JSON.stringify(messages);
// Guardar mensajes en localStorage
localStorage.setItem('chatMessages', messagesToSave);
  }
}, [messages]);

// Cargar mensajes del almacenamiento local al iniciar
useEffect(() => {
  const savedMessages = localStorage.getItem('chatMessages');
  if (savedMessages) {
    try {
      const parsed = JSON.parse(savedMessages);
      // Convertir strings de fecha a objetos Date
      const messagesWithDates = parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(messagesWithDates);
    } catch (e) {
      console.error('Error al cargar mensajes guardados:', e);
    }
  }
}, []);

// Función para abrir el chat
const openChat = useCallback(() => {
  setIsOpen(true);
  setIsMinimized(false);
}, []);

// Función para cerrar el chat
const closeChat = useCallback(() => {
  setIsOpen(false);
}, []);

// Función para minimizar el chat
const minimizeChat = useCallback(() => {
  setIsMinimized(prev => !prev);
}, []);

// Función para maximizar el chat
const maximizeChat = useCallback(() => {
  setIsMinimized(false);
}, []);

// Función para enviar un mensaje
const sendMessage = useCallback(async (text: string, attachments?: Array<{ type: 'image' | 'file' | 'audio'; url: string; name?: string }>) => {
  // Crear un nuevo mensaje del usuario
  const userMessageId = uuidv4();
  const userMessage: MessageType = {
    id: userMessageId,
    text,
    sender: 'user',
    timestamp: new Date(),
    status: 'sending',
    attachments
  };
  
  // Añadir el mensaje del usuario a la lista
  setMessages(prev => [...prev, userMessage]);
  
  // Actualizar el estado del mensaje a "enviado"
  setTimeout(() => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === userMessageId 
          ? { ...msg, status: 'sent' } 
          : msg
      )
    );
  }, 500);
  
  // Actualizar el estado del mensaje a "leído" después de un tiempo
  setTimeout(() => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === userMessageId 
          ? { ...msg, status: 'read' } 
          : msg
      )
    );
  }, 2000);
  
  // Simular "escribiendo..." del bot durante unos segundos
  // En una implementación real, aquí se conectaría con un servicio de IA
  
  try {
    // Obtener respuesta del bot
    const botResponse = await generateBotResponse(text);
    
    // Crear un nuevo mensaje del bot
    const botMessage: MessageType = {
      id: uuidv4(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };
    
    // Añadir el mensaje del bot a la lista
    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    console.error('Error al obtener respuesta del bot:', error);
    
    // Marcar el mensaje del usuario como error
    setMessages(prev => 
      prev.map(msg => 
        msg.id === userMessageId 
          ? { ...msg, status: 'error' } 
          : msg
      )
    );
  }
}, []);

// Función para eliminar un mensaje
const deleteMessage = useCallback((id: string) => {
  setMessages(prev => prev.filter(msg => msg.id !== id));
}, []);

// Función para limpiar el chat
const clearChat = useCallback(() => {
  setMessages([]);
  localStorage.removeItem('chatMessages');
}, []);


// Función para marcar un mensaje como leído
const markMessageAsRead = useCallback((id: string) => {
  setMessages(prev => 
    prev.map(msg => 
      msg.id === id 
        ? { ...msg, status: 'read', isRead: true } 
        : msg
    )
  );
}, []);

// Función para reaccionar a un mensaje
const reactToMessage = useCallback((id: string, reaction: 'like' | 'dislike') => {
  setMessages(prev => 
    prev.map(msg => {
      if (msg.id === id) {
        return { 
          ...msg, 
          reactions: { 
            ...msg.reactions,
            liked: reaction === 'like' ? true : false,
            disliked: reaction === 'dislike' ? true : false
          } 
        };
      }
      return msg;
    })
  );
}, []);

// Función para reenviar un mensaje que falló
const resendMessage = useCallback(async (id: string) => {
  // Buscar el mensaje original
  const messageToResend = messages.find(msg => msg.id === id);
  
  if (messageToResend && messageToResend.sender === 'user') {
    // Marcar como "enviando"
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id 
          ? { ...msg, status: 'sending' } 
          : msg
      )
    );
    
    try {
      // Obtener respuesta del bot
      const botResponse = await generateBotResponse(messageToResend.text);
      
      // Actualizar estado del mensaje original
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id 
            ? { ...msg, status: 'read' } 
            : msg
        )
      );
      
      // Crear un nuevo mensaje del bot
      const botMessage: MessageType = {
        id: uuidv4(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        isRead: false // Añade esta línea para marcar como no leído por defecto
      };
      // Añadir el mensaje del bot a la lista
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al reenviar mensaje:', error);
      
      // Marcar nuevamente como error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id 
            ? { ...msg, status: 'error' } 
            : msg
        )
      );
    }
  }
}, [messages]);

// Exponer la función getBotResponse para uso directo en componentes
const getBotResponse = useCallback(async (userMessage: string): Promise<string> => {
  return generateBotResponse(userMessage);
}, []);

return (
  <ChatbotContext.Provider
    value={{
      isOpen,
      isMinimized,
      messages,
      position,
      openChat,
      closeChat,
      minimizeChat,
      maximizeChat,
      updatePosition,
      sendMessage,
      deleteMessage,
      clearChat,
      markMessageAsRead,
      reactToMessage,
      resendMessage,
      getBotResponse
    }}
  >
    {children}
  </ChatbotContext.Provider>
);
}