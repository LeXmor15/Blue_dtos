// src/components/chatbot/ChatWindow.tsx
import { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../../context/ChatbotContext';

const ChatWindow = () => {
  const { isOpen, isMinimized, messages, minimizeChat, sendMessage } = useChatbot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  if (!isOpen || isMinimized) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-gray-900 rounded-lg shadow-xl flex flex-col overflow-hidden z-40">
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
        <div className="uppercase text-xs font-bold">Chat abierto</div>
        <button 
          onClick={minimizeChat}
          className="text-white hover:text-gray-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-br from-blue-900 to-blue-950">
        <div className="space-y-3">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-white mr-2 flex-shrink-0">
                  <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white">
                    B
                  </div>
                </div>
              )}
              
              <div 
                className={`max-w-[80%] p-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-white'
                }`}
              >
                <p>{message.text}</p>
              </div>
              
              {message.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 ml-2 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-2 flex">
        <input
          type="text"
          ref={inputRef}
          className="flex-1 bg-gray-700 text-white rounded px-3 py-2 focus:outline-none"
          placeholder="Escribe aquí..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          type="submit"
          className="ml-2 bg-black text-white px-4 py-2 rounded"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;