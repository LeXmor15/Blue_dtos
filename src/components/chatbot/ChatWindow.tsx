// src/components/chatbot/ChatWindow.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { useChatbot } from '../../context/ChatbotContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Importación de iconos
import { 
  Send, 
  Minimize2, 
  Maximize2, 
  X, 
  Mic, 
  Camera, 
  Paperclip, 
  MoreVertical, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  Share2, 
  RefreshCw,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Search,
  Move,
  Headphones, // Para dictar mensaje individual
  StopCircle, // Para detener la dicción
  Settings  // Para configuración de voz
} from 'lucide-react';


// Tipos
type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'read' | 'error';
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

type SuggestionType = {
  id: string;
  text: string;
};

const ChatWindow = () => {
  const { isOpen, isMinimized, messages, minimizeChat, sendMessage, closeChat, markMessageAsRead} = useChatbot();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

   // Estados para Text-to-Speech
   const [isSpeaking, setIsSpeaking] = useState(false);
   const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);
   const [voiceOptions, setVoiceOptions] = useState<SpeechSynthesisVoice[]>([]);
   const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
   const [speechRate, setSpeechRate] = useState(1);
   const [speechPitch, setSpeechPitch] = useState(1);
   const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  
  // Estado para manejar el arrastre del chat
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  
  // Sugerencias de mensajes rápidos
  const suggestions: SuggestionType[] = [
    { id: '1', text: '¿Cómo puedo ayudarte hoy?' },
    { id: '2', text: '¿Cuáles son sus horarios de atención?' },
    { id: '3', text: 'Necesito hacer un reclamo' },
    { id: '4', text: '¿Tienen servicio técnico?' },
  ];


  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Marcar todos los mensajes del bot como leídos cuando la ventana está abierta
      messages.forEach(msg => {
        if (msg.sender === 'bot' && (msg.isRead === false || msg.status !== 'read')) {
          markMessageAsRead(msg.id);
        }
      });
    }
  }, [isOpen, isMinimized, messages, markMessageAsRead]);
  
  // Obtener las voces disponibles cuando se carga el componente
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoiceOptions(availableVoices);
        
        // Intentar encontrar una voz en español, o usar la primera disponible
        const spanishVoice = availableVoices.find(voice => 
          voice.lang.includes('es') || voice.name.includes('Spanish')
        );
        setSelectedVoice(spanishVoice || availableVoices[0]);
      }
    };

    // En algunos navegadores, las voces pueden no estar disponibles inmediatamente
    if (window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length) {
        loadVoices();
      }
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Limpiar al desmontar
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);
  
  // Función para leer un mensaje en voz alta
  const speakMessage = useCallback((text: string, messageId: string) => {
    if (!window.speechSynthesis || !selectedVoice) return;
    
    // Detener cualquier mensaje hablado previamente
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.lang = selectedVoice.lang;
    
    // Establecer eventos para rastrear el estado
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingId(messageId);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      console.error('Error en la síntesis de voz');
    };
    
    window.speechSynthesis.speak(utterance);
  }, [selectedVoice, speechRate, speechPitch]);
  
  // Función para detener la síntesis de voz
  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    }
  }, []);

  // Leer automáticamente los mensajes del bot cuando llegan si no está silenciado
  useEffect(() => {
    if (messages.length > 0 && !isMuted) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot') {
        speakMessage(lastMessage.text, lastMessage.id);
      }
    }
  }, [messages, isMuted, speakMessage]);
  
  // Detener la síntesis de voz cuando se minimiza o cierra el chat
  useEffect(() => {
    if (isMinimized || !isOpen) {
      stopSpeaking();
    }
  }, [isMinimized, isOpen, stopSpeaking]);
  
  // Detener la síntesis de voz cuando el botón de mute está activado
  useEffect(() => {
    if (isMuted) {
      stopSpeaking();
    }
  }, [isMuted, stopSpeaking]);

  

  // Auto-scroll al recibir nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus en el input cuando se abre el chat
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Inicializar posición cuando se monta el componente
  useEffect(() => {
    // Colocar el chat en una posición inicial razonable cuando se abre
    if (!isMinimized && !isFullscreen) {
      setPosition({
        x: window.innerWidth - 400,
        y: 100
      });
    }
  }, [isMinimized, isFullscreen]);
  
  // Simulación de reconocimiento de voz
  const toggleVoiceRecording = useCallback(() => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simular grabación iniciada
      setTimeout(() => {
        setInput(prev => prev + 'Texto transcrito del audio ');
        setIsRecording(false);
      }, 3000);
    }
  }, [isRecording]);

  // Simulación de carga de archivos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      sendMessage(`He adjuntado un archivo: ${fileName}`, [{
        type: 'file',
        url: '#',
        name: fileName
      }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
      // Ocultar sugerencias después de enviar un mensaje
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
    setShowSuggestions(false);
  };

  // Funciones para manejar el arrastre
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isFullscreen || isMinimized) return; // No permitir arrastre en fullscreen o minimizado
    if (e.target instanceof HTMLElement) {
      // Solo iniciar arrastre si se hace click en el header
      if (!e.target.closest('.chat-header')) return;
    }
    
    setIsDragging(true);
    const rect = chatWindowRef.current?.getBoundingClientRect();
    
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    
    // Prevenir selección de texto durante el arrastre
    e.preventDefault();
  }, [isFullscreen, isMinimized]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    // Limitar el movimiento dentro de la ventana
    const newX = Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, dragOffset]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Añadir/remover event listeners para el arrastre
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  // Resetear posición cuando cambia el modo de pantalla completa
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    // Resetear posición al cambiar a/desde pantalla completa
    if (isFullscreen) {
      // Si estamos saliendo de pantalla completa, posicionar en una ubicación adecuada
      setPosition({ 
        x: window.innerWidth - 400,
        y: 100
      });
    }
  }, [isFullscreen]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };

<div className="flex space-x-1">
  <button
    onClick={() => setShowVoiceSettings(!showVoiceSettings)}
    className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
    title="Configuración de voz"
  >
    <Settings size={18} />
  </button>

  <button 
    onClick={() => {
      if (!isMuted) {
        // Si no está silenciado y vamos a silenciar
        stopSpeaking(); // Detenemos la síntesis primero
      }
      toggleMute(); // Cambiamos el estado
    }} 
    className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
    title={isMuted ? "Activar sonido" : "Silenciar"}
  >
    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
  </button>
</div>


  // Filtrar mensajes en la búsqueda
  const filteredMessages = searchTerm 
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  // Copiar mensaje al portapapeles
  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    // Mostrar notificación de copiado
    alert('Mensaje copiado al portapapeles');
  };

  // Reaccionar a un mensaje
  const reactToMessage = (id: string, reaction: 'like' | 'dislike') => {
    // Aquí iría la lógica para guardar la reacción
    console.log(`Reacción ${reaction} al mensaje ${id}`);
  };

  const getTimeString = (date: Date) => {
    return format(date, 'HH:mm');
  };

  if (!isOpen) return null;

  // Calcular estilos para el contenedor principal
  const getContainerStyles = () => {
    // En pantalla completa o minimizado, usar posiciones fijas
    if (isFullscreen) {
      return {
        inset: 0, // equivalente a top: 0, right: 0, bottom: 0, left: 0
        width: '100%',
        height: '100%'
      };
    } else if (isMinimized) {
      return {
        bottom: '1rem',
        right: '1rem',
        width: '16rem',
        height: '3.5rem'
      };
    } else {
      // En modo normal, usar la posición arrastrable
      return {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '24rem',
        height: '32rem'
      };
    }
  };
  
  const containerClass = `
    fixed z-40 transition-all duration-300 ease-in-out
    ${isDarkMode ? 'dark' : ''}
  `;

  const innerContainerClass = `
    rounded-xl shadow-2xl overflow-hidden flex flex-col h-full
    bg-gradient-to-br ${isDarkMode ? 'from-gray-900 to-gray-950' : 'from-white to-gray-100'}
    border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}
  `;

  return (
    <motion.div 
      ref={chatWindowRef}
      className={containerClass}
      style={getContainerStyles()}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      onMouseDown={handleMouseDown}
    >
      <div className={innerContainerClass}>
        {/* Header */}
        <div className={`chat-header ${isDarkMode ? 'bg-gray-800' : 'bg-blue-600'} text-white p-3 flex justify-between items-center cursor-move`}> 
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-xl font-bold">A</span>
            </div>
            {!isMinimized && (
              <div className="flex items-center">
                <div className="mr-2">
                  <div className="font-bold">Asistente Virtual</div>
                  <div className="text-xs opacity-70">En línea ahora</div>
                </div>
                {!isFullscreen && (
                  <div className="text-xs opacity-70 flex items-center" title="Arrastra para mover">
                    <Move size={14} className="mr-1" />
                    <span className="hidden sm:inline">Arrastra para mover</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex space-x-1">
            {!isMinimized && (
              <>
                <button onClick={toggleSearch} className="p-1 rounded-full hover:bg-white hover:bg-opacity-20">
                  <Search size={18} />
                </button>
                <button onClick={toggleMute} className="p-1 rounded-full hover:bg-white hover:bg-opacity-20">
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button onClick={toggleDarkMode} className="p-1 rounded-full hover:bg-white hover:bg-opacity-20">
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button 
                  onClick={toggleFullscreen} 
                  className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                  title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </>
            )}
            <button 
              onClick={minimizeChat}
              className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            {!isMinimized && (
              <button 
                onClick={closeChat}
                className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        
        {!isMinimized && (
          <>
            {/* Barra de búsqueda */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <Search size={16} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                    <input
                      id="search-input"
                      type="text"
                      className={`w-full bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                      placeholder="Buscar en la conversación..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showVoiceSettings && !isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
                >
                  <h3 className="font-medium mb-2">Configuración de voz</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Voz</label>
                      <select
                        className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                        value={selectedVoice?.name || ''}
                        onChange={(e) => {
                          const voice = voiceOptions.find(v => v.name === e.target.value);
                          if (voice) setSelectedVoice(voice);
                        }}
                      >
                        {voiceOptions.map((voice) => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Velocidad: {speechRate.toFixed(1)}x</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Tono: {speechPitch.toFixed(1)}</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={speechPitch}
                        onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowVoiceSettings(false)}
                        className={`px-3 py-1 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Mensajes */}
            <div className={`flex-1 p-4 overflow-y-auto ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {filteredMessages.length === 0 && searchTerm && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Search size={40} className="mb-2 opacity-50" />
                  <p>No se encontraron mensajes para "{searchTerm}"</p>
                </div>
              )}
              
              {filteredMessages.length === 0 && !searchTerm && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">A</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Asistente Virtual</h3>
                  <p className="text-sm opacity-70 max-w-xs">
                    Hola, soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 self-end rounded-full mr-2 flex-shrink-0 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">A</span>
                      </div>
                    )}
                    
                    <div className="max-w-[80%] group">
                      <div 
                        className={`
                          p-3 rounded-2xl relative
                          ${message.sender === 'user' 
                            ? isDarkMode 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-500 text-white' 
                            : isDarkMode
                              ? 'bg-gray-800 text-white border border-gray-700' 
                              : 'bg-white text-gray-800 border border-gray-200'
                          }
                        `}
                      >
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        
                        {/* Adjuntos de mensajes si existen */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, idx) => (
                              <div 
                                key={idx} 
                                className={`
                                  p-2 rounded-lg flex items-center text-sm
                                  ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                                `}
                              >
                                <Paperclip size={14} className="mr-2" />
                                <span>{attachment.name || 'Archivo adjunto'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Hora del mensaje */}
                        <div className={`
                          text-xs mt-1 opacity-70 flex justify-between items-center
                          ${message.sender === 'user' ? 'text-right' : ''}
                        `}>
                          <span>{getTimeString(message.timestamp || new Date())}</span>
                          
                          {/* Estado de envío para mensajes del usuario */}
                          {message.sender === 'user' && message.status && (
                            <span>
                              {message.status === 'sending' && '🕒'}
                              {message.status === 'sent' && '✓'}
                              {message.status === 'read' && '✓✓'}
                              {message.status === 'error' && '❌'}
                            </span>
                          )}
                        </div>
                        
                        {/* Menú contextual emergente en hover */}
                        <div className={`
                          absolute ${message.sender === 'user' ? '-left-12' : '-right-12'} top-0
                          opacity-0 group-hover:opacity-100 transition-opacity
                          flex flex-col space-y-1
                        `}>
                          <button 
                            onClick={() => copyMessage(message.text)}
                            className={`
                              p-1 rounded-full
                              ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                            `}
                          >
                            <Copy size={14} />
                          </button>
                          
                          {message.sender === 'bot' && (
                            <><button
                              onClick={() => isSpeaking && currentSpeakingId === message.id
                                ? stopSpeaking()
                                : speakMessage(message.text, message.id)
                              }
                              className={`
                              p-1 rounded-full
                              ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                              ${currentSpeakingId === message.id ? 'text-blue-500' : ''}
                            `}
                              title={isSpeaking && currentSpeakingId === message.id ? "Detener dictado" : "Dictar mensaje"}
                            >
                              {isSpeaking && currentSpeakingId === message.id ? <StopCircle size={14} /> : <Headphones size={14} />}
                            </button>
                              <button
                                onClick={() => reactToMessage(message.id, 'like')}
                                className={`
                                  p-1 rounded-full
                                  ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                                  ${message.reactions?.liked ? 'text-green-500' : ''}
                                `}
                              >
                                <ThumbsUp size={14} />
                              </button>

                              <button
                                onClick={() => reactToMessage(message.id, 'dislike')}
                                className={`
                                  p-1 rounded-full
                                  ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                                  ${message.reactions?.disliked ? 'text-red-500' : ''}
                                `}
                              >
                                <ThumbsDown size={14} />
                              </button>
                            </>
                          )}
                          
                          <button 
                            className={`
                              p-1 rounded-full
                              ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                            `}
                          >
                            <Share2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 self-end rounded-full ml-2 flex-shrink-0 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">T</span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Sugerencias de mensajes rápidos */}
            <AnimatePresence>
              {showSuggestions && messages.length < 2 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`px-4 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                >
                  <p className="text-xs mb-2 opacity-70">Sugerencias:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map(suggestion => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className={`
                          text-xs px-3 py-1.5 rounded-full whitespace-nowrap
                          ${isDarkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                            : 'bg-white hover:bg-gray-200 text-gray-800 border border-gray-300'}
                        `}
                      >
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Indicador de escritura */}
            <AnimatePresence>
              {false && ( // Cambiar a true para mostrar "escribiendo..."
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`px-4 py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mr-2">
                    <span className="text-xs font-bold text-white">A</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Input */}
            <form onSubmit={handleSubmit} className={`p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
              <div className={`
                flex items-end rounded-xl p-2
                ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
              `}>
                <div className="flex space-x-1 mr-2">
                  <button 
                    type="button" 
                    onClick={toggleVoiceRecording}
                    className={`
                      p-2 rounded-full 
                      ${isRecording 
                        ? 'bg-red-500 text-white' 
                        : `${isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-300 text-gray-600'}`
                      }
                    `}
                  >
                    <Mic size={18} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      p-2 rounded-full 
                      ${isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-300 text-gray-600'}
                    `}
                  >
                    <Paperclip size={18} />
                  </button>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button 
                    type="button"
                    className={`
                      p-2 rounded-full 
                      ${isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-300 text-gray-600'}
                    `}
                  >
                    <Camera size={18} />
                  </button>
                </div>
                
                <input
                  type="text"
                  ref={inputRef}
                  className={`
                    flex-1 bg-transparent text-base focus:outline-none min-h-[24px] max-h-[100px] overflow-auto
                    ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'}
                  `}
                  placeholder={isRecording ? "Grabando audio..." : "Escribe tu mensaje..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                
                <button 
                  type="submit"
                  disabled={!input.trim() && !isRecording}
                  className={`
                    ml-2 p-2 rounded-full transition-colors
                    ${input.trim() || isRecording
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500'}`
                    }
                  `}
                >
                  <Send size={18} />
                </button>
              </div>
              
              {/* Pie de página */}
              <div className="mt-2 text-xs text-center opacity-50">
                <span>Desarrollado con tecnología AI avanzada</span>
              </div>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ChatWindow;