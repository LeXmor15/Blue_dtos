// src/components/chatbot/Chatbot.tsx
import ChatbotButton from './ChatbotButton';
import ChatWindow from './ChatWindow';
import { useChatbot } from '../../context/ChatbotContext';

const Chatbot = () => {
  const { isOpen, isMinimized } = useChatbot();

  return (
    <>
      <ChatbotButton />
      {(isOpen && !isMinimized) && <ChatWindow />}
    </>
  );
};

export default Chatbot;