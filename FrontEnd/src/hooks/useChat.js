import { useState, useCallback } from 'react';
import { sendMessageToAgent } from '../services/api';
import { generateId } from '../utils/helpers';

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: generateId(),
      sender: 'agent',
      text: 'Hello! I am StockGPT, your AI Stock Research Agent. How can I assist you with your investments today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: generateId(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      // Get agent response
      const agentResponse = await sendMessageToAgent(text, messages);
      setMessages((prev) => [...prev, agentResponse]);
    } catch (err) {
      setError('Failed to get a response. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return {
    messages,
    isTyping,
    error,
    sendMessage
  };
};
